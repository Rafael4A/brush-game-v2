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
      synchronize: true, // TODO Set to false in production
      entities: [Room, Player],
    } as TypeOrmModuleOptions),

    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, "..", "client"),
    //   exclude: ["/api*"],
    //   serveStaticOptions: {
    //     index: false,
    //   },
    // }),

    GatewayModule,

    RoomModule,

    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
