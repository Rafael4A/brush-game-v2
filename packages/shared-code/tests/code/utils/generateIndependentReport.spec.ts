import { generateIndependentReports } from "../../../code";
import {
  PLAYER1_INDEPENDENT_REPORT_STUB,
  PLAYER2_INDEPENDENT_REPORT_STUB,
  ROUND_OVER_ROOM_STUB,
} from "../../utils";

describe("generateIndependentReports tests", () => {
  it("should generate reports with the correct values", () => {
    // Arrange
    const exptected = [
      PLAYER1_INDEPENDENT_REPORT_STUB,
      PLAYER2_INDEPENDENT_REPORT_STUB,
    ];
    // Act
    const result = generateIndependentReports(ROUND_OVER_ROOM_STUB);
    // Assert
    expect(result).toEqual(exptected);
  });
});
