import { playerWithHigherProperty } from "../../../code";
import { IndependentReportUnit } from "../../../types";
import {
  PLAYER1_INDEPENDENT_REPORT_STUB,
  PLAYER2_INDEPENDENT_REPORT_STUB,
  TestData,
} from "../../utils";

describe("playerWithHigherProperty tests", () => {
  it.each<TestData<keyof IndependentReportUnit, string | null>>([
    { value: "brushes", expected: null },
    { value: "previousPoints", expected: "Player 1" },
    { value: "sum", expected: "Player 2" },
    { value: "totalCards", expected: "Player 2" },
    { value: "totalDiamonds", expected: "Player 1" },
  ])(
    "should return the nickname of the player with the highest property",
    ({ value: property, expected }) => {
      // Arrange
      const independentReports = [
        PLAYER1_INDEPENDENT_REPORT_STUB,
        PLAYER2_INDEPENDENT_REPORT_STUB,
      ];
      // Act
      const result = playerWithHigherProperty(independentReports, property);
      // Assert
      expect(result).toBe(expected);
    }
  );
});
