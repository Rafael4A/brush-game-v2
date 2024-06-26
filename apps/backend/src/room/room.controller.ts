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

import {
  KickPlayerDto,
  NewRoomDto,
  PlayCardDto,
  StartGameDto,
} from "shared-code";

import { RoomService } from "./room.service";

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post("/room")
  async create(@Body() { nickname }: NewRoomDto) {
    return this.roomService.create(nickname);
  }

  @Get("/room/:id")
  async get(@Param("id") id: string, @Query("playerId") playerId: string) {
    return this.roomService.get(id, playerId);
  }

  @Post("/room/:id/join")
  @HttpCode(HttpStatus.OK)
  async join(@Param("id") id: string, @Body() { nickname }: NewRoomDto) {
    return this.roomService.join(id, nickname);
  }

  @Post("/room/:id/start-game")
  @HttpCode(HttpStatus.OK)
  async start(@Param("id") id: string, @Body() { playerId }: StartGameDto) {
    return this.roomService.startRoomGame(id, playerId);
  }

  @Post("/room/:id/next-round")
  @HttpCode(HttpStatus.OK)
  async nextRound(@Param("id") id: string, @Body() { playerId }: StartGameDto) {
    return this.roomService.nextRoomRound(id, playerId);
  }

  @Post("/room/:id/play-card")
  @HttpCode(HttpStatus.OK)
  async playCard(
    @Param("id") id: string,
    @Body() { playerId, cardCode, tableCardCodes }: PlayCardDto
  ) {
    return this.roomService.playRoomCard(
      id,
      playerId,
      cardCode,
      tableCardCodes
    );
  }

  @Get("/room/:id/report")
  async getReport(
    @Param("id") id: string,
    @Query("playerId") playerId: string
  ) {
    return this.roomService.getReport(id, playerId);
  }

  @Delete("/room/:id/kick-player")
  async kickPlayer(
    @Param("id") id: string,
    @Body() { kickedPlayerNick, playerId }: KickPlayerDto
  ) {
    return this.roomService.kickPlayer(id, playerId, kickedPlayerNick);
  }

  @Delete("/room/:id/leave")
  async leaveRoom(
    @Param("id") id: string,
    @Query("playerId") playerId: string
  ) {
    return this.roomService.leaveRoom(id, playerId);
  }
}
