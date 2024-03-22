import { PlayerReport, Room } from "../types";
import { generateIndependentReports, playerWithHigherProperty } from "./utils";

export function generateReport(room: Room) {
  const independentReport = generateIndependentReports(room);

  const playerWithMostCards = playerWithHigherProperty(
    independentReport,
    "totalCards"
  );

  const playerWithMostDiamonds = playerWithHigherProperty(
    independentReport,
    "totalDiamonds"
  );

  const playerWithHighestSum = playerWithHigherProperty(
    independentReport,
    "sum"
  );

  const report = independentReport.map<PlayerReport>((pr) => {
    const hasMoreCards = pr.nickname === playerWithMostCards;

    const hasMoreDiamonds = pr.nickname === playerWithMostDiamonds;

    const hasHighestSum = pr.nickname === playerWithHighestSum;

    return {
      ...pr,
      hasMoreCards,
      hasMoreDiamonds,
      hasHighestSum,
      currentPoints:
        pr.previousPoints +
        pr.brushes +
        (pr.hasBeauty ? 1 : 0) +
        (hasMoreCards ? 1 : 0) +
        (hasMoreDiamonds ? 1 : 0) +
        (hasHighestSum ? 1 : 0),
    };
  });

  return report;
}
