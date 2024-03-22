import { randomInt } from "../../../code";

describe("randomInt tests", () => {
  it.each([
    { min: 0, max: 2 },
    { min: 2, max: 3 },
    { min: 0, max: 10 },
  ])("should return a number inside the passed bounds", ({ min, max }) => {
    // Act
    const result = randomInt(min, max);
    // Assert
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });

  it.each([
    { min: 1, max: 1 },
    { min: 0, max: 0 },
  ])(
    "should return the same number if it's the only possibility",
    ({ min, max }) => {
      // Act
      const result = randomInt(min, max);
      // Assert
      expect(result).toBe(min);
      expect(result).toBe(max);
    }
  );
});
