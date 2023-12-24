import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GatewayModule } from "../gateway.module";
import { Player, Room } from "./entities";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player]), GatewayModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
