import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GatewayModule } from "../gateway.module";
import { Player, Room } from "./entities";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomValidations } from "./room.validations";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player]), GatewayModule],
  controllers: [RoomController],
  providers: [RoomService, RoomValidations],
})
export class RoomModule {}
