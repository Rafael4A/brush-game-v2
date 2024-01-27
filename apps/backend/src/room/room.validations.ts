import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { CardCode, GameState } from "shared-code";

import { Player, Room } from "./entities";
@Injectable()
export class RoomValidations {
  public playCardValidations(
    room: Room,
    player: Player,
    cardCode: CardCode,
    usedTableCardsCodes: CardCode[]
  ) {
    if (room.gameState !== GameState.Playing)
      throw new HttpException(
        "The game is not in progress",
        HttpStatus.BAD_REQUEST
      );

    if (
      room.players.find((p) => p.nickname === room.currentTurn).id !== player.id
    )
      throw new HttpException("It's not your turn", HttpStatus.UNAUTHORIZED);

    if (!player.cards.includes(cardCode))
      throw new HttpException(
        "You don't have this card",
        HttpStatus.BAD_REQUEST
      );

    const roomTableCardsCodes = room.table.map((c) => c);
    const tableCardsAreValid = usedTableCardsCodes.every((c) =>
      roomTableCardsCodes.includes(c)
    );

    if (!tableCardsAreValid)
      throw new HttpException("Invalid table cards", HttpStatus.BAD_REQUEST);
  }

  public nextRoundValidations(room: Room, player: Player) {
    if (player.isOwner === false) {
      throw new HttpException(
        "Only the room owner can start the game",
        HttpStatus.BAD_REQUEST
      );
    }

    if (room.gameState !== GameState.RoundOver)
      throw new HttpException(
        "Cannot start a new round now",
        HttpStatus.BAD_REQUEST
      );
  }

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

  public startGameValidations(room: Room, player: Player) {
    if (player.isOwner === false) {
      throw new HttpException(
        "Only the room owner can start the game",
        HttpStatus.BAD_REQUEST
      );
    }

    if (room.gameState !== GameState.WaitingForPlayers)
      throw new HttpException(
        "The game has already started",
        HttpStatus.BAD_REQUEST
      );

    if (room.players.length <= 1)
      throw new HttpException(
        "The game needs at least 2 players",
        HttpStatus.BAD_REQUEST
      );
  }
}
