import { IndependentReportUnit, Room } from "../../types";
import { calculateNumberCardsSum } from "./calculateNumberCardsSum";
import { getCardCodeSuit } from "./getCardCodeSuit";
import { getSummableCards } from "./getSummableCards";

export function generateIndependentReports(
  room: Room
): IndependentReportUnit[] {
  return room.players.map((p) => {
    const summableCards = getSummableCards(p.collectedCards);
    return {
      brushes: p.currentBrushCount,
      hasBeauty: p.collectedCards.some((c) => c === "7D"),
      nickname: p.nickname,
      previousPoints: p.previousPoints,
      sum: calculateNumberCardsSum(summableCards),
      sumCards: summableCards,
      totalCards: p.collectedCards.length,
      totalDiamonds: p.collectedCards.filter(
        (c) => getCardCodeSuit(c) === "DIAMONDS"
      ).length,
    };
  });
}
