import { evaluateCardCode } from "../../../code";
import { CardCode } from "../../../types";
import { TestData } from "../../utils";

describe("evaluateCardCode tests", () => {
  it.each<TestData<CardCode, number>>([
    { value: "AS", expected: 1 },
    { value: "2C", expected: 2 },
    { value: "4H", expected: 4 },
    { value: "7D", expected: 7 },
    { value: "QS", expected: 8 },
    { value: "JC", expected: 9 },
    { value: "KD", expected: 10 },
  ])(
    "should return the correct value for a card code",
    ({ value: cardCode, expected }) => {
      // Act
      const result = evaluateCardCode(cardCode);
      // Assert
      expect(result).toBe(expected);
    }
  );
});
