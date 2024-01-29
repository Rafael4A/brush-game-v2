import { CardCode } from "./card";
import { Player } from "./player";

export enum GameState {
  WaitingForPlayers = "WaitingForPlayers",
  Playing = "Playing",
  RoundOver = "RoundOver",
  GameOver = "GameOver",
}

export interface Room {
  id: string;
  creationDate: Date;
  cards: CardCode[];
  table: CardCode[];
  players: Player[];
  firstPlayerNick?: string;
  currentTurn?: string;
  gameState: GameState;
}
