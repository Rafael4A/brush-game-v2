import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CronModule } from "./cron/cron.module";
import { dbdatasource } from "./data.source";
import { GatewayModule } from "./gateway/gateway.module";
import { RoomModule } from "./room/room.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbdatasource),
    GatewayModule,
    RoomModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
})
export class AppModule {}
