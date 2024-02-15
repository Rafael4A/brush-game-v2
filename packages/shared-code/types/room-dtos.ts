import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

import type { CardCode } from "./card";
import type { Opponent, Player } from "./player";
import { GameState } from "./room";

export class NewRoomDto {
  @IsNotEmpty({ message: "Player nickname is required" })
  @IsString({ message: "Player nickname must be a string" })
  @Length(2, 20, {
    message: "Player nickname must be between 2 and 20 characters",
  })
  nickname: string;
}

export type NewRoomDtoType = typeof NewRoomDto.prototype;

export interface BasicRoomResponseDto {
  id: string;
  playerId: string;
}

export class GetRoomResponseDto {
  id: string;
  table: CardCode[];
  player: Player;
  remainingCards: number;
  currentTurn: string;
  gameState: GameState;
  opponents: Opponent[];
}

export class StartGameDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;
}

export type StartGameDtoType = typeof StartGameDto.prototype;

export class PlayCardDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;

  @IsNotEmpty({ message: "Card code is required" })
  @IsString({ message: "Card code must be a string" })
  cardCode: CardCode;

  @IsArray({ message: "Table card codes must be an array" })
  @ArrayUnique({ message: "Table card codes must be unique" })
  @IsString({
    each: true,
    message: "Each table card code in the array must be a string",
  })
  tableCardCodes: CardCode[];
}

export type PlayCardDtoType = typeof PlayCardDto.prototype;

export class KickPlayerDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;

  @IsNotEmpty({ message: "Kicked player nickname is required" })
  @IsString({ message: "Kicked player nickname must be a string" })
  kickedPlayerNick: string;
}

export type KickPlayerDtoType = typeof KickPlayerDto.prototype;
