import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Room, Player } from "../../room/entities";

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Player) private playerRepository: Repository<Player>
  ) {}

  async getRoomForPlayer(roomId: string, playerId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ["players"],
    });

    return room?.players?.some((p) => p.id === playerId) ? room : undefined;
  }
}
