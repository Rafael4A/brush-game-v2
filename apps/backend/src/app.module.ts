import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CronModule } from "./cron/cron.module";
import { GatewayModule } from "./gateway/gateway.module";
import { Player, Room } from "./room/entities";
import { RoomModule } from "./room/room.module";

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.IS_DEV == "true",
      entities: [Room, Player],
    } as TypeOrmModuleOptions),

    GatewayModule,

    RoomModule,

    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
