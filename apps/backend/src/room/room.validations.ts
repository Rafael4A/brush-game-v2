import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { GameState } from "shared-code";

import { Room } from "./entities";
@Injectable()
export class RoomValidations {
  public joinValidations(room: Room, nickname: string) {
    if (room.gameState !== GameState.WaitingForPlayers)
      throw new HttpException(
        "The game has already started",
        HttpStatus.BAD_REQUEST
      );

    if (room.players.some((p) => p.nickname === nickname))
      throw new HttpException(
        "A player with the same name is already in the room",
        HttpStatus.BAD_REQUEST
      );
  }
  public kickPlayer(room: Room, playerId: string, kickedNick: string) {
    if (room.gameState !== GameState.WaitingForPlayers)
      throw new HttpException(
        "You can't kick a player after the game has started",
        HttpStatus.BAD_REQUEST
      );
    if (room.players.find((p) => p.id === playerId).nickname === kickedNick)
      throw new HttpException(
        "You can't kick yourself",
        HttpStatus.BAD_REQUEST
      );
    if (!room.players.some((p) => p.nickname === kickedNick))
      throw new HttpException(
        "This player is not in the room",
        HttpStatus.BAD_REQUEST
      );
  }
}
