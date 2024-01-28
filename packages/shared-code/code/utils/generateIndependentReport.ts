import { IndependentReport, Room } from "../../types";
import { calculateCardsSum, getSummableCards } from "./calculateNumberCardsSum";
import { getCardCodeSuit } from "./getCardCodeSuit";

export function generateIndependentReport(room: Room): IndependentReport[] {
  return room.players.map((p) => {
    const summableCards = getSummableCards(p.collectedCards);
    return {
      brushes: p.currentBrushCount,
      hasBeauty: p.collectedCards.some((c) => c === "7D"),
      nickname: p.nickname,
      previousPoints: p.previousPoints,
      sum: calculateCardsSum(summableCards),
      sumCards: summableCards,
      totalCards: p.collectedCards.length,
      totalDiamonds: p.collectedCards.filter(
        (c) => getCardCodeSuit(c) === "DIAMONDS"
      ).length,
    };
  });
}
