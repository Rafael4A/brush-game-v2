import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Player, Room } from "./entities";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
