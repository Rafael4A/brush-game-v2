import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import { Repository } from "typeorm";

import {
  CardCode,
  MoveBroadcast,
  SocketEvents,
  shuffleCards,
  startGame,
  playCard,
  generateReport,
  nextRound,
  CARDS_CODES,
  RequestedRoomMapper,
} from "shared-code";

import { AppGateway } from "../gateway/app.gateway";
import { Player, Room } from "./entities";
import { BasicRoomMapper } from "./room.mapper";
import { RoomValidations } from "./room.validations";
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    private appGateway: AppGateway,
    private validations: RoomValidations
  ) {}
  private logger: Logger = new Logger("RoomService");

  private generateId() {
    return crypto.randomBytes(3).toString("hex");
  }

  private async findById(id: string, playerId?: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ["players"],
    });

    if (!room) {
      this.logger.error(`Room not found: ${id}`);
      throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
    }

    if (!playerId) {
      return room;
    }

    const player = room.players.some((p) => p.id === playerId);

    if (!player) {
      this.logger.error(`Player ${playerId} not allowed to access room ${id}`);
      throw new HttpException(
        "This player cannot access the requested room",
        HttpStatus.UNAUTHORIZED
      );
    }

    return room;
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
      this.logger.error("Error creating room: " + error?.message, error?.stack);
      throw new HttpException(
        "Error creating room",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async get(id: string, playerId: string) {
    this.validations.playerIdPresent(playerId);

    const room = await this.findById(id, playerId);

    return RequestedRoomMapper.map(room, playerId);
  }

  async join(id: string, nickname: string) {
    try {
      const room = await this.findById(id);

      this.validations.join(room, nickname);

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
    } catch (error) {
      this.logger.error(
        "Error joining room: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "nickname: ",
        nickname
      );
      throw new HttpException(
        "Error joining room",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async startRoomGame(id: string, playerId: string) {
    const room = await this.findById(id, playerId);

    try {
      const updatedRoom = startGame(room, playerId);

      await this.roomRepository.save(updatedRoom);
    } catch (error) {
      this.logger.error(
        "Error starting room game: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "player: ",
        playerId
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    this.appGateway.server.to(room.id).emit(SocketEvents.GameStarted);
  }

  async playRoomCard(
    id: string,
    playerId: string,
    cardCode: CardCode,
    usedTableCardsCodes: CardCode[]
  ) {
    const room = await this.findById(id, playerId);

    try {
      const updatedRoom = playCard(
        room,
        playerId,
        cardCode,
        usedTableCardsCodes
      );

      await this.roomRepository.save(updatedRoom);

      this.appGateway.server.to(room.id).emit(SocketEvents.MoveBroadcast, {
        playedCard: cardCode,
      } satisfies MoveBroadcast);

      return RequestedRoomMapper.map(updatedRoom, playerId);
    } catch (error) {
      this.logger.error(
        "Error playing card: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "player: ",
        playerId,
        "cardCode: ",
        cardCode,
        "usedTableCardsCodes: ",
        usedTableCardsCodes
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReport(id: string, playerId: string) {
    this.validations.playerIdPresent(playerId);
    const room = await this.findById(id, playerId);
    return generateReport(room);
  }

  public async nextRoomRound(id: string, playerId: string) {
    const room = await this.findById(id, playerId);

    try {
      const updatedRoom = nextRound(room, playerId);

      await this.roomRepository.save(updatedRoom);

      this.appGateway.server.to(room.id).emit(SocketEvents.GameStarted);
    } catch (error) {
      this.logger.error(
        "Error advancing round: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "player: ",
        playerId
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async kickPlayer(
    id: string,
    playerId: string,
    kickedPlayerNick: string
  ) {
    const room = await this.findById(id, playerId);

    this.validations.kickPlayer(room, playerId, kickedPlayerNick);

    try {
      const updatedRoom: Room = {
        ...room,
        players: room.players.filter((p) => p.nickname !== kickedPlayerNick),
      };

      await this.roomRepository.save(updatedRoom);

      this.appGateway.server.to(room.id).emit(SocketEvents.LeftRoom);
    } catch (error) {
      this.logger.error(
        "Error kicking player: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "player: ",
        playerId,
        "kickPlayerNick: ",
        kickedPlayerNick
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async leaveRoom(id: string, playerId: string) {
    this.validations.playerIdPresent(playerId);

    const room = await this.findById(id, playerId);

    try {
      const updatedRoom: Room = {
        ...room,
        players: room.players.filter((p) => p.id !== playerId),
      };

      await this.roomRepository.save(updatedRoom);

      this.appGateway.server.to(room.id).emit(SocketEvents.LeftRoom);
    } catch (error) {
      this.logger.error(
        "Error leaving room: " + error?.message,
        error?.stack,
        "room: ",
        id,
        "player: ",
        playerId
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
