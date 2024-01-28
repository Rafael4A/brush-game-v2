import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";

import * as crypto from "crypto";
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
} from "shared-code";
import { EntityManager, Repository } from "typeorm";

import { AppGateway } from "../gateway/app.gateway";
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

  async startRoomGame(id: string, playerId: string) {
    const room = await this.findById(id, playerId);

    try {
      const updatedRoom = startGame(room, playerId);

      await this.roomRepository.save(updatedRoom);
    } catch (error) {
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReport(id: string, playerId: string) {
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
