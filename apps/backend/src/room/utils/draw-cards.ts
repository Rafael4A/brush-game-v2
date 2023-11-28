import { Card } from "shared-types";

export function drawCards(cards: Card[], drawCount: number) {
  return {
    drawn: cards.slice(0, drawCount),
    remainingCards: cards.slice(drawCount),
  };
}
