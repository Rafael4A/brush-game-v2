import { calculateNumberCardsSum } from "../../../code";
import { CardCode } from "../../../types";
import { TestData } from "../../utils";

describe("calculateNumberCardsSum tests", () => {
  it("should return zero if no summable cards are present", () => {
    // Arrange
    const cards: CardCode[] = ["QC", "JD", "JH", "KS"];
    // Act
    const result = calculateNumberCardsSum(cards);
    // Assert
    expect(result).toBe(0);
  });

  it.each<TestData<CardCode[], number>>([
    { value: ["QC", "JD", "JH", "KS", "2C"], expected: 2 },
    { value: ["QC", "JD", "JH", "KS", "2C", "3D", "4H"], expected: 9 },
    {
      value: [
        "5H",
        "QC",
        "JD",
        "JH",
        "KS",
        "2C",
        "3C",
        "4C",
        "2D",
        "3D",
        "7D",
        "AS",
        "5S",
        "6S",
      ],
      expected: 22,
    },
  ])("should sum only summable cards correctly", ({ value, expected }) => {
    // Act
    const result = calculateNumberCardsSum(value);
    // Assert
    expect(result).toBe(expected);
  });
});
