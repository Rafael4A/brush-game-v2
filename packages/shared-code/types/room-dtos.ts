import type { CardCode } from "./card";
import type { Opponent, Player } from "./player";
import { GameState } from "./room";

export interface NewRoomDto {
  nickname: string;
} // Move classes to backend and create types here

export interface BasicRoomResponseDto {
  id: string;
  playerId: string;
}

export interface GetRoomResponseDto {
  id: string;
  table: CardCode[];
  player: Player;
  remainingCards: number;
  currentTurn?: string;
  gameState: GameState;
  opponents: Opponent[];
}

export interface StartGameDto {
  playerId: string;
}

export interface PlayCardDto {
  playerId: string;
  cardCode: CardCode;
  tableCardCodes: CardCode[];
}

export interface KickPlayerDto {
  playerId: string;
  kickedPlayerNick: string;
}
