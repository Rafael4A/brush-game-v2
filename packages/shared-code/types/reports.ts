import { CardCode } from "./card";

export interface IndependentReport {
  nickname: string;
  previousPoints: number;
  brushes: number;
  hasBeauty: boolean;
  totalCards: number;
  totalDiamonds: number;
  sum: number;
  sumCards: CardCode[];
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
  sumCards: CardCode[];
  previousPoints: number;
  currentPoints: number;
}
