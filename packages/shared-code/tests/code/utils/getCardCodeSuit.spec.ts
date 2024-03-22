import { getCardCodeSuit } from "../../../code";
import { CardCode } from "../../../types";
import { TestData } from "../../utils";

describe("getCardCodeSuit tests", () => {
  it.each<TestData<CardCode, "SPADES" | "CLUBS" | "HEARTS" | "DIAMONDS">>([
    { value: "2C", expected: "CLUBS" },
    { value: "4H", expected: "HEARTS" },
    { value: "7D", expected: "DIAMONDS" },
    { value: "AS", expected: "SPADES" },
    { value: "KD", expected: "DIAMONDS" },
    { value: "QH", expected: "HEARTS" },
  ])(
    "should return the correct suit of a card code",
    ({ value: cardCode, expected }) => {
      // Act
      const result = getCardCodeSuit(cardCode);
      // Assert
      expect(result).toBe(expected);
    }
  );
});
