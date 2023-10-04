import type { Card } from "./card";

export interface Player {
  nickname: string;
  id: string;
  cards: Card[];
  previousPoints: number;
  collectedCards: Card[];
  currentBrushCount: number;
}

export interface PlayerReport {
  cardCount: number;
  diamondCount: number;
  brushCount: number;
  cardSum: number;
  hasBeauty: boolean;
  previousPoints: number;
}

export interface Opponent {
  nickname: string;
  previousPoints: number;
}
