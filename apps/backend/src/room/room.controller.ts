import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

import { NewRoomDto, StartGameDto } from "shared-types";

import { RoomService } from "./room.service";

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get("/rooms")
  async getAll() {
    return this.roomService.getAll();
  }

  @Delete("/rooms")
  async deleteAll() {
    return this.roomService.deleteAll();
  }

  @Post("/room")
  async create(@Body() { nickname }: NewRoomDto) {
    return this.roomService.create(nickname);
  }

  @Get("/room/:id")
  async get(@Param("id") id: string, @Query("playerId") playerId: string) {
    return this.roomService.get(id, playerId);
  }

  @Post("/room/:id/join")
  async join(@Param("id") id: string, @Body() { nickname }: NewRoomDto) {
    return this.roomService.join(id, nickname);
  }

  @Post("/room/:id/start-game")
  @HttpCode(HttpStatus.OK)
  async start(@Param("id") id: string, @Body() { playerId }: StartGameDto) {
    return this.roomService.startGame(id, playerId);
  }

  // TODO: Create play card endpoint
}
