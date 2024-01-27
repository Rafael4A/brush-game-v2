import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";

import * as crypto from "crypto";
import {
  CardCode,
  GameState,
  MoveBroadcast,
  Player as PlayerInterface,
  PlayerReport,
  SocketEvents,
  Room as RoomInterface,
  IndependentReport,
  calculateCardsSum,
  drawCards,
  getCardCodeSuit,
  getSummableCards,
  nextTurnIndex,
  playerWithHigherProperty,
  shuffleCards,
  willSumToFifteen,
} from "shared-code";
import { EntityManager, Repository } from "typeorm";

import { AppGateway } from "../gateway/app.gateway";
import { CARDS_CODES } from "../resources";
import { Player, Room } from "./entities";
import { BasicRoomMapper, RequestedRoomMapper } from "./room.interface";
import { RoomValidations } from "./room.validations";
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectEntityManager() private entityManager: EntityManager,
    private appGateway: AppGateway,
    private validations: RoomValidations
  ) {}

  private generateId() {
    return crypto.randomBytes(3).toString("hex");
  }

  private async findById(id: string, playerId?: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ["players"],
    });

    if (!room) {
      throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
    }

    if (!playerId) {
      return room;
    }

    const player = room.players.some((p) => p.id === playerId);

    if (!player) {
      throw new HttpException(
        "This player cannot access the requested room",
        HttpStatus.UNAUTHORIZED
      );
    }

    return room;
  }

  // TODO APAGAR ANTES DE CHEGAR EM PRODUÇÃO
  async getAll() {
    return await this.roomRepository.find({
      relations: ["players"],
    });
  }

  // TODO APAGAR ANTES DE CHEGAR EM PRODUÇÃO
  async deleteAll() {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(Room, {});
    });
  }

  async create(nickname: string) {
    try {
      let id = this.generateId();

      while (await this.roomRepository.findOne({ where: { id } })) {
        id = this.generateId();
      }

      const room = this.roomRepository.create({
        id,
        players: [{ nickname, isOwner: true, id: crypto.randomUUID() }],
        cards: shuffleCards(CARDS_CODES),
      });

      const savedRoom = await this.roomRepository.save(room);

      return BasicRoomMapper.map(savedRoom, savedRoom.players[0].id);
    } catch (error) {
      throw new HttpException(
        "Error creating room",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async get(id: string, playerId: string) {
    const room = await this.findById(id, playerId);

    return RequestedRoomMapper.map(room, playerId);
  }

  async join(id: string, nickname: string) {
    const room = await this.findById(id);

    this.validations.joinValidations(room, nickname);

    const newPlayer = this.playerRepository.create({
      nickname,
      id: crypto.randomUUID(),
    });

    await this.roomRepository.manager.transaction(async (manager) => {
      const roomRepository = manager.getRepository(Room);
      const updatedRoom = await roomRepository.findOne({
        where: { id },
        relations: ["players"],
      });
      updatedRoom.players.push(newPlayer);
      await manager.save(Room, updatedRoom);
    });

    this.appGateway.server.to(room.id).emit(SocketEvents.JoinedRoom);
    return BasicRoomMapper.map(room, newPlayer.id);
  }

  async startGame(id: string, playerId: string) {
    const room = await this.findById(id, playerId);
    const player = room.players.find((p) => p.id === playerId);

    this.validations.startGameValidations(room, player);

    const startingPlayer =
      room.players[crypto.randomInt(0, room.players.length)].nickname;

    const {
      drawn: roomTableCards,
      remainingCards: remainingCardsAfterTableIsDealt,
    } = drawCards(room.cards, 4);

    // Each player draws 3 cards
    const { players: updatedPlayers, remainingCards } = room.players.reduce(
      ({ players, remainingCards }, player) => {
        const { drawn, remainingCards: remainingCardsAfterPlayerIsDealt } =
          drawCards(remainingCards, 3);

        return {
          players: [...players, { ...player, cards: drawn }],
          remainingCards: remainingCardsAfterPlayerIsDealt,
        };
      },
      { players: [], remainingCards: remainingCardsAfterTableIsDealt }
    );

    const updatedRoom = {
      ...room,
      gameState: GameState.Playing,
      currentTurn: startingPlayer,
      firstPlayerIndex: startingPlayer,
      table: roomTableCards,
      cards: remainingCards,
      players: updatedPlayers,
    };

    await this.roomRepository.save(updatedRoom);

    this.appGateway.server.to(room.id).emit(SocketEvents.GameStarted);
  }

  async playCard(
    id: string,
    playerId: string,
    cardCode: CardCode,
    usedTableCardsCodes: CardCode[]
  ) {
    const room = await this.findById(id, playerId);

    const player = room.players.find((p) => p.id === playerId);

    this.validations.playCardValidations(
      room,
      player,
      cardCode,
      usedTableCardsCodes
    );

    const allCardsCodes = [cardCode, ...usedTableCardsCodes];

    if (usedTableCardsCodes.length === 0) {
      // Simply moves card from player to table
      const updatedTable = [cardCode, ...room.table];
      const updatedPlayerCards = player.cards.filter((c) => c !== cardCode);
      const updatedPlayers = room.players.map((p) =>
        p.id === playerId ? { ...p, cards: updatedPlayerCards } : p
      );
      const updatedRoom = {
        ...room,
        table: updatedTable,
        players: updatedPlayers,
      };

      return this.handleTurnEnd(updatedRoom, playerId, cardCode);
    } else if (willSumToFifteen(allCardsCodes)) {
      // When the sum of the cards is 15, the player collects the cards
      const usedTableCards = room.table.filter((c) =>
        usedTableCardsCodes.includes(c)
      );

      const updatedPlayerCollectedCards = [
        ...player.collectedCards,
        ...usedTableCards,
        cardCode,
      ];

      const updatedTable = room.table.filter(
        (c) => !usedTableCardsCodes.includes(c)
      );
      const updatedPlayerCards = player.cards.filter((c) => c !== cardCode);

      const updatedPlayers = room.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              cards: updatedPlayerCards,
              collectedCards: updatedPlayerCollectedCards,
              currentBrushCount:
                p.currentBrushCount + (updatedTable.length === 0 ? 1 : 0),
            }
          : p
      );

      const updatedRoom = {
        ...room,
        table: updatedTable,
        players: updatedPlayers,
      };

      return this.handleTurnEnd(updatedRoom, playerId, cardCode);
    } else {
      throw new HttpException("Cards sum is not 15", HttpStatus.BAD_REQUEST);
    }
  }

  private async handleTurnEnd(
    room: RoomInterface,
    playerId: string,
    playedCard: CardCode
  ) {
    const player = room.players.find((p) => p.id === playerId);

    let finalRoom: RoomInterface;
    await this.roomRepository.manager.transaction(async (manager) => {
      const roomAfterDraw = this.drawCardsIfPossible(room, player);

      const roomAfterTurnUpdate = this.updateTurn(roomAfterDraw);

      finalRoom = {
        ...roomAfterTurnUpdate,
        gameState: this.nextGameState(roomAfterTurnUpdate),
      };

      await manager.save(Room, finalRoom);
    });

    this.appGateway.server.to(room.id).emit(SocketEvents.MoveBroadcast, {
      playedCard,
    } satisfies MoveBroadcast);

    return RequestedRoomMapper.map(finalRoom, playerId);
  }

  private drawCardsIfPossible(room: RoomInterface, player: PlayerInterface) {
    if (player.cards.length === 0 && room.cards.length >= 3) {
      const { drawn, remainingCards: updatedRoomCards } = drawCards(
        room.cards,
        3
      );

      const updatedPlayerCards = [...player.cards, ...drawn];

      const updatedPlayers = room.players.map((p) =>
        p.id === player.id ? { ...p, cards: updatedPlayerCards } : p
      );

      return {
        ...room,
        cards: updatedRoomCards,
        players: updatedPlayers,
      };
    }

    return room;
  }

  private nextGameState(room: RoomInterface) {
    const totalRemainingCards =
      room.cards.length +
      room.players.reduce((acc, p) => acc + p.cards.length, 0);

    if (totalRemainingCards === 0) {
      const report = this.generateReport(room);

      return report.some((r) => r.currentPoints >= 15)
        ? GameState.GameOver
        : GameState.RoundOver;
    } else {
      return room.gameState;
    }
  }

  private updateTurn(room: RoomInterface) {
    const nextPlayerIndex = nextTurnIndex(
      room.players.findIndex((player) => player.nickname === room.currentTurn),
      room.players.length
    );
    return { ...room, currentTurn: room.players[nextPlayerIndex].nickname };
  }

  async getReport(id: string, playerId: string) {
    const room = await this.findById(id, playerId);
    return this.generateReport(room);
  }

  private generateReport(room: RoomInterface) {
    const independentReport = this.generateIndependentReport(room);

    const playerWithMostCards = playerWithHigherProperty(
      independentReport,
      "totalCards"
    );

    const playerWithMostDiamonds = playerWithHigherProperty(
      independentReport,
      "totalDiamonds"
    );

    const playerWithHighestSum = playerWithHigherProperty(
      independentReport,
      "sum"
    );

    const report = independentReport.map<PlayerReport>((pr) => {
      const hasMoreCards = pr.nickname === playerWithMostCards;

      const hasMoreDiamonds = pr.nickname === playerWithMostDiamonds;

      const hasHighestSum = pr.nickname === playerWithHighestSum;

      return {
        ...pr,
        hasMoreCards,
        hasMoreDiamonds,
        hasHighestSum,
        currentPoints:
          pr.previousPoints +
          pr.brushes +
          (pr.hasBeauty ? 1 : 0) +
          (hasMoreCards ? 1 : 0) +
          (hasMoreDiamonds ? 1 : 0) +
          (hasHighestSum ? 1 : 0),
      };
    });

    return report;
  }

  private generateIndependentReport(room: RoomInterface): IndependentReport[] {
    return room.players.map((p) => {
      const summableCards = getSummableCards(p.collectedCards);
      return {
        brushes: p.currentBrushCount,
        hasBeauty: p.collectedCards.some((c) => c === "7D"),
        nickname: p.nickname,
        previousPoints: p.previousPoints,
        sum: calculateCardsSum(summableCards),
        sumCards: summableCards,
        totalCards: p.collectedCards.length,
        totalDiamonds: p.collectedCards.filter(
          (c) => getCardCodeSuit(c) === "DIAMONDS"
        ).length,
      };
    });
  }

  public async nextRound(id: string, playerId: string) {
    const room = await this.findById(id, playerId);
    const player = room.players.find((p) => p.id === playerId);

    this.validations.nextRoundValidations(room, player);

    const nextPlayerIndex = nextTurnIndex(
      room.players.findIndex(
        (player) => player.nickname === room.firstPlayerIndex
      ),
      room.players.length
    );
    room.cards = shuffleCards(CARDS_CODES);
    room.table = [];

    const report = await this.getReport(id, playerId);
    room.players = room.players.map((p) => {
      return {
        ...p,
        cards: [],
        collectedCards: [],
        currentBrushCount: 0,
        previousPoints: report.find((r) => r.nickname === p.nickname)
          .currentPoints,
      };
    });

    const {
      drawn: roomTableCards,
      remainingCards: remainingCardsAfterTableIsDealt,
    } = drawCards(room.cards, 4);

    // Each player draws 3 cards
    const { players: updatedPlayers, remainingCards } = room.players.reduce(
      ({ players, remainingCards }, player) => {
        const { drawn, remainingCards: remainingCardsAfterPlayerIsDealt } =
          drawCards(remainingCards, 3);

        return {
          players: [...players, { ...player, cards: drawn }],
          remainingCards: remainingCardsAfterPlayerIsDealt,
        };
      },
      { players: [], remainingCards: remainingCardsAfterTableIsDealt }
    );

    const updatedRoom = {
      ...room,
      gameState: GameState.Playing,
      currentTurn: room.players[nextPlayerIndex].nickname,
      firstPlayerIndex: room.players[nextPlayerIndex].nickname,
      table: roomTableCards,
      cards: remainingCards,
      players: updatedPlayers,
    };

    await this.roomRepository.save(updatedRoom);
    this.appGateway.server.to(room.id).emit(SocketEvents.GameStarted);
  }
}
