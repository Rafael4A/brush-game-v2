import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RoomController } from "./room.controller";
import {
  PLAYER_MODEL_NAME,
  PlayerSchema,
  ROOM_MODEL_NAME,
  RoomSchema,
} from "./room.schema";
import { RoomService } from "./room.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ROOM_MODEL_NAME, schema: RoomSchema },
      { name: PLAYER_MODEL_NAME, schema: PlayerSchema },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
