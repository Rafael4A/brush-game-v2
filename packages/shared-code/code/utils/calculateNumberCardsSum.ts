import { CardCode } from "shared-code";

import { evaluateCardCode } from "./evaluateCardCode";
import { getSummableCards } from "./getSummableCards";

export function calculateNumberCardsSum(cards: CardCode[]): number {
  const summableCards = getSummableCards(cards);
  const summableCardsValues = summableCards.map(evaluateCardCode);
  return summableCardsValues.reduce((acc, value) => acc + value, 0);
}
