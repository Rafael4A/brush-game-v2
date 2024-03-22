import type { CardCode } from "./card";

export interface Player {
  nickname: string;
  id: string;
  cards: CardCode[];
  previousPoints: number;
  collectedCards: CardCode[];
  currentBrushCount: number;
  isOwner: boolean;
}

export interface Opponent {
  nickname: string;
  isOwner: boolean;
  previousPoints: number;
}
