import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";

import * as crypto from "crypto";
import { GameState, Player as PlayerInterface } from "shared-types";
import { EntityManager, Repository } from "typeorm";

import { dbRoomToRoom, drawCards, nextTurnIndex, roomToDbRoom } from "../utils";
import { willSumToFifteen } from "../utils/will-sum-to-fifteen";
import { Card, Player, Room } from "./entities";
import {
  Room as RoomInterface,
  BasicRoomMapper,
  RequestedRoomMapper,
} from "./room.interface";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectEntityManager() private entityManager: EntityManager
  ) {}

  private generateId() {
    return crypto.randomBytes(3).toString("hex");
  }

  private async findById(id: string, playerId?: string) {
    const dbRoom = await this.roomRepository.findOne({
      where: { id },
      relations: ["players"],
    });

    if (!dbRoom) {
      throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
    }
    const room = dbRoomToRoom(dbRoom);

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
    return (
      await this.roomRepository.find({
        relations: ["players"],
      })
    ).map((room) => dbRoomToRoom(room));
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
      });

      const savedRoom = await this.roomRepository.save(room);

      return BasicRoomMapper.map(
        dbRoomToRoom(savedRoom),
        savedRoom.players[0].id
      );
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

    if (room.gameState !== GameState.WaitingForPlayers)
      throw new HttpException(
        "The game has already started",
        HttpStatus.BAD_REQUEST
      );

    const player = room.players.some((p) => p.nickname === nickname);
    if (player)
      throw new HttpException(
        "A player with the same name is already in the room",
        HttpStatus.BAD_REQUEST
      );

    const newPlayer = this.playerRepository.create({
      nickname,
      id: crypto.randomUUID(),
    });

    await this.roomRepository.manager.transaction(async (manager) => {
      // TODO try to change the following two lines to be: const updatedRoom = await manager.findOne(Room, { where: { id } });
      const roomRepository = manager.getRepository(Room);
      const updatedRoom = await roomRepository.findOne({
        where: { id },
        relations: ["players"],
      });
      updatedRoom.players.push(newPlayer);
      await manager.save(Room, updatedRoom);
    });

    return BasicRoomMapper.map(room, newPlayer.id);
  }

  async startGame(id: string, playerId: string) {
    const room = await this.findById(id, playerId);
    const player = room.players.find((p) => p.id === playerId);

    if (player.isOwner === false) {
      throw new HttpException(
        "Only the room owner can start the game",
        HttpStatus.BAD_REQUEST
      );
    }

    if (room.gameState !== GameState.WaitingForPlayers)
      throw new HttpException(
        "The game has already started",
        HttpStatus.BAD_REQUEST
      );

    if (room.players.length <= 1)
      throw new HttpException(
        "The game needs at least 2 players",
        HttpStatus.BAD_REQUEST
      );

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

    await this.roomRepository.save(roomToDbRoom(updatedRoom));
  }

  async playCard(
    id: string,
    playerId: string,
    cardCode: string,
    usedTableCardsCodes: string[]
  ) {
    const room = await this.findById(id, playerId);

    if (room.gameState !== GameState.Playing)
      throw new HttpException(
        "The game is not in progress",
        HttpStatus.BAD_REQUEST
      );

    if (room.players[room.currentTurn].id !== playerId)
      throw new HttpException("It's not your turn", HttpStatus.UNAUTHORIZED);

    const player = room.players.find((p) => p.id === playerId);

    const card = player.cards.find((c) => c.code === cardCode);

    if (!card)
      throw new HttpException(
        "You don't have this card",
        HttpStatus.BAD_REQUEST
      );

    const roomTableCardsCodes = room.table.map((c) => c.code);
    const tableCardsAreValid = usedTableCardsCodes.every((c) =>
      roomTableCardsCodes.includes(c)
    );

    if (!tableCardsAreValid)
      throw new HttpException("Invalid table cards", HttpStatus.BAD_REQUEST);

    const allCardsCodes = [cardCode, ...usedTableCardsCodes];

    if (usedTableCardsCodes.length === 0) {
      // Simply moves card from player to table
      const updatedTable = [...room.table, card];
      const updatedPlayerCards = player.cards.filter(
        (c) => c.code !== cardCode
      );
      const updatedPlayers = room.players.map((p) =>
        p.id === playerId ? { ...p, cards: updatedPlayerCards } : p
      );
      const updatedRoom = {
        ...room,
        table: updatedTable,
        players: updatedPlayers,
      };

      return this.handleTurnEnd(updatedRoom, playerId);
    } else if (willSumToFifteen(allCardsCodes)) {
      const usedTableCards = room.table.filter((c) =>
        usedTableCardsCodes.includes(c.code)
      );

      const updatedPlayerCollectedCards = [
        ...player.collectedCards,
        ...usedTableCards,
        card,
      ];

      const updatedTable = room.table.filter(
        (c) => !usedTableCardsCodes.includes(c.code)
      );
      const updatedPlayerCards = player.cards.filter(
        (c) => c.code !== cardCode
      );

      const updatedPlayers = room.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              cards: updatedPlayerCards,
              collectedCards: updatedPlayerCollectedCards,
            }
          : p
      );

      const updatedRoom = {
        ...room,
        table: updatedTable,
        players: updatedPlayers,
      };

      return this.handleTurnEnd(updatedRoom, playerId);
    } else {
      throw new HttpException("Cards sum is not 15", HttpStatus.BAD_REQUEST);
    }
  }

  private async handleTurnEnd(room: RoomInterface, playerId: string) {
    const player = room.players.find((p) => p.id === playerId);

    await this.roomRepository.manager.transaction(async (manager) => {
      const updatedRoom = await manager.findOne(Room, {
        where: { id: room.id },
      });
      const roomAfterDraw = this.drawCardsIfPossible(
        dbRoomToRoom(updatedRoom),
        player
      );
      const roomAfterTurnUpdate = this.updateTurn(roomAfterDraw);
      const isRoundOver = this.checkIfRoundIsOver(roomAfterTurnUpdate);
      const finalRoom = isRoundOver
        ? { ...roomAfterTurnUpdate, gameState: GameState.RoundOver }
        : roomAfterTurnUpdate;

      await manager.save(Room, roomToDbRoom(finalRoom));
      // Additional logic or notifications can be added here.
    });
    // Enviar notificação para todos os jogadores (Socket IO ou SSE)
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

  private checkIfRoundIsOver(room: RoomInterface) {
    return (
      room.cards.length +
        room.players.reduce((acc, p) => acc + p.cards.length, 0) ===
      0
    );
  }

  private updateTurn(room: RoomInterface) {
    const nextPlayerIndex = nextTurnIndex(
      room.players.findIndex((player) => player.nickname === room.currentTurn),
      room.players.length
    );
    return { ...room, currentTurn: room.players[nextPlayerIndex].nickname };
  }
}
