import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { join } from "path";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GatewayModule } from "./gateway.module";
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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"), // adjust this path to point to your React app's build directory
      exclude: ["/api*"], // exclude API routes from static files serving
    }),

    GatewayModule,

    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
