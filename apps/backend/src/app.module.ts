import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";

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
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin",
      database: "postgres",
      synchronize: true, // TODO Set to false in production
      entities: [Room, Player],
    }),

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
