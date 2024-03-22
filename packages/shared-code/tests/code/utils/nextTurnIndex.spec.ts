import { nextTurnIndex } from "../../../code";

describe("nextTurnIndex tests", () => {
  it("should return the next index when the current index is not the last one", () => {
    // Arrange
    const current = 1;
    const arrayLength = 3;
    // Act
    const result = nextTurnIndex(current, arrayLength);
    // Assert
    expect(result).toBe(2);
  });

  it("should return 0 when the current index is the last one", () => {
    // Arrange
    const current = 2;
    const arrayLength = 3;
    // Act
    const result = nextTurnIndex(current, arrayLength);
    // Assert
    expect(result).toBe(0);
  });
});
