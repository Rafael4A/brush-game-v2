import type { Card } from "./card";

export interface Player {
  nickname: string;
  id: string;
  cards: Card[];
  previousPoints: number;
  collectedCards: Card[];
  currentBrushCount: number;
  isOwner: boolean;
}

export interface PlayerReport {
  nickname: string;
  brushes: number;
  hasBeauty: boolean;
  hasMoreCards: boolean;
  totalCards: number;
  hasMoreDiamonds: boolean;
  totalDiamonds: number;
  hasHighestSum: boolean;
  sum: number;
  previousPoints: number;
  currentPoints: number;
}

export interface Opponent {
  nickname: string;
  isOwner: boolean;
  previousPoints: number;
}
