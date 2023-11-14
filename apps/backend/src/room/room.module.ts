import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Card, Player, Room } from "./entities";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player, Card])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
