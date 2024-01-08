import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Player, Room } from "../room/entities";
import { AppGateway } from "./app.gateway";
import { ValidationService } from "./sockets/validation.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player])],
  providers: [AppGateway, ValidationService],
  exports: [AppGateway],
})
export class GatewayModule {}
