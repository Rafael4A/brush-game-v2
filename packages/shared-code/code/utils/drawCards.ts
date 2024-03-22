import { CardCode } from "../../types";

export function drawCards(cards: CardCode[], drawCount: number) {
  return {
    drawn: cards.slice(0, drawCount),
    remainingCards: cards.slice(drawCount),
  };
}
