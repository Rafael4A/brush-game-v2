import { IsNotEmpty, IsString, Length } from "class-validator";

import type { Card } from "./card";
import type { Opponent, Player } from "./player";

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
  table: Card[];
  player: Player;
  remainingCards: number;
  currentTurn: string;
  gameState: GameState;
  opponents: Opponent[];
}

export enum GameState {
  WaitingForPlayers = "WaitingForPlayers",
  Playing = "Playing",
  RoundOver = "RoundOver",
  GameOver = "GameOver",
}

export class StartGameDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;
}

export type StartGameDtoType = typeof StartGameDto.prototype;
