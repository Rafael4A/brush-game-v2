import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RoomModule } from "./room/room.module";

@Module({
  imports: [
    //TODO EXTRAIR MONGO URI PARA ENV
    MongooseModule.forRoot("YOUR MONGO DB URI HERE"),
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
