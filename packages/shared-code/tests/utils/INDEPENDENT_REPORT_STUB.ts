import { IndependentReportUnit } from "../../types";

export const PLAYER1_INDEPENDENT_REPORT_STUB: IndependentReportUnit = {
  brushes: 1,
  hasBeauty: true,
  nickname: "Player 1",
  previousPoints: 5,
  sum: 23,
  sumCards: ["7D", "5S", "6C", "5H"],
  totalCards: 17,
  totalDiamonds: 6,
};

export const PLAYER2_INDEPENDENT_REPORT_STUB: IndependentReportUnit = {
  brushes: 1,
  hasBeauty: false,
  nickname: "Player 2",
  previousPoints: 4,
  sum: 27,
  sumCards: ["6D", "7S", "7C", "7H"],
  totalCards: 20,
  totalDiamonds: 3,
};
