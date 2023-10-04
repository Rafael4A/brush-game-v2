import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import * as crypto from "crypto";
import { Model } from "mongoose";
import { GameState, Player } from "shared-types";

import { drawCards, nextTurnIndex } from "../utils";
import { willSumToFifteen } from "../utils/will-sum-to-fifteen";
import { Room, BasicRoomMapper, RequestedRoomMapper } from "./room.interface";
import { PLAYER_MODEL_NAME, ROOM_MODEL_NAME } from "./room.schema";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(ROOM_MODEL_NAME) private roomModel: Model<Room>,
    @InjectModel(PLAYER_MODEL_NAME) private playerModel: Model<Player>
  ) {}

  private generateId() {
    return crypto.randomBytes(3).toString("hex");
  }

  private async findById(id: string, playerId?: string) {
    const room = await this.roomModel.findOne({ id }).lean().exec();
    if (!room) throw new HttpException("Room not found", HttpStatus.NOT_FOUND);

    if (!playerId) return room;

    const player = room.players.some((p) => p.id === playerId);
    if (!player)
      throw new HttpException(
        "This player cannot access the requested room",
        HttpStatus.UNAUTHORIZED
      );

    return room;
  }

  // TODO APAGAR ANTES DE CHEGAR EM PRODUÇÃO
  async getAll() {
    return this.roomModel.find().lean().exec();
  }
  // TODO APAGAR ANTES DE CHEGAR EM PRODUÇÃO
  async deleteAll() {
    return this.roomModel.deleteMany({}).exec();
  }

  async create(nickname: string) {
    try {
      let id = this.generateId();

      while (await this.roomModel.findOne({ id }).lean().exec()) {
        id = this.generateId();
      }

      const room = new this.roomModel({ id, players: [{ nickname }] });

      const savedRoom = await room.save();

      return BasicRoomMapper.map(savedRoom, savedRoom.players[0].id);
    } catch (error) {
      console.error(error);
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

    const newPlayer = new this.playerModel({ nickname });

    const updatedRoom = await this.roomModel
      .findOneAndUpdate(
        { id },
        { $push: { players: newPlayer } },
        { returnDocument: "after" }
      )
      .lean()
      .exec();

    const updatedNewPlayer =
      updatedRoom.players[updatedRoom.players.length - 1];

    return BasicRoomMapper.map(updatedRoom, updatedNewPlayer.id);
  }

  async startGame(id: string, playerId: string) {
    const room = await this.findById(id, playerId);

    if (room.players[0].id !== playerId) {
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

    const startingPlayer = crypto.randomInt(0, room.players.length);

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

    await this.roomModel.updateOne({ id }, updatedRoom).exec();
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
  private async handleTurnEnd(room: Room, playerId: string) {
    const player = room.players.find((p) => p.id === playerId);
    const roomAfterDraw = this.drawCardsIfPossible(room, player);
    const roomAfterTurnUpdate = this.updateTurn(roomAfterDraw);
    const isRoundOver = this.checkIfRoundIsOver(roomAfterTurnUpdate);
    const updatedRoom = isRoundOver
      ? {
          ...room,
          gameState: GameState.RoundOver,
        }
      : roomAfterTurnUpdate;

    await this.roomModel.updateOne({ id: updatedRoom.id }, updatedRoom).exec();
  }

  private drawCardsIfPossible(room: Room, player: Player) {
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

  private checkIfRoundIsOver(room: Room) {
    return (
      room.cards.length +
        room.players.reduce((acc, p) => acc + p.cards.length, 0) ===
      0
    );
  }

  private updateTurn(room: Room) {
    const nextPlayerIndex = nextTurnIndex(
      room.currentTurn,
      room.players.length
    );
    return { ...room, currentTurn: nextPlayerIndex };
  }
}
