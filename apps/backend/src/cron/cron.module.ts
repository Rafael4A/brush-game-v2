import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Player, Room } from "../room/entities";
import { CronService } from "./cron.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Player])],
  providers: [CronService],
})
export class CronModule {}
