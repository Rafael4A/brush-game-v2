import { willSumToFifteen } from "../../../code";
import { CardCode } from "../../../types";

describe("willSumToFifteen tests", () => {
  it.each([
    ["KC", "5S"], // 10 + 5 = 15
    ["JC", "6D"], // 9 + 6 = 15
    ["QD", "7S"], // 8 + 7 = 15
    ["5D", "5H", "5S"], // 5 + 5 + 5 = 15
    ["AS", "4S", "KD"], // 1 + 4 + 10 = 15
    ["7S", "7C", "AD"], // 7 + 7 + 1 = 15
    ["6S", "4C", "5D"], // 6 + 4 + 5 = 15
    ["3S", "3C", "3D", "6H"], // 3 + 3 + 3 + 6 = 15
    ["4S", "4C", "7D"], // 4 + 4 + 7 = 15
    ["5S", "5C", "5D"], // 5 + 5 + 5 = 15
    ["6S", "6C", "3D"], // 6 + 6 + 3 = 15
    ["7S", "7C", "AD"], // 7 + 7 + 1 = 15
    ["AS", "2S", "3C", "4D", "5H"], // 1 + 2 + 3 + 4 + 5 = 15
    ["2S", "2C", "2D", "2H", "7S"], // 2 + 2 + 2 + 2 + 7 = 15
    ["3S", "3C", "3D", "3H", "3S"], // 3 + 3 + 3 + 3 + 3 = 15
  ] satisfies CardCode[][])(
    "should return true when sum is 15",
    (...cardsCodes) => {
      // Act
      const result = willSumToFifteen(cardsCodes);
      // Assert
      expect(result).toBe(true);
    }
  );

  it.each([
    ["JC", "AD"], // 9 + 1 = 10
    ["QD", "JS"], // 8 + 9 = 17
    ["KC", "6S"], // 10 + 6 = 16
    ["AD", "2H", "3S"], // 1 + 2 + 3 = 6
    ["AS", "4S", "5D"], // 1 + 4 + 5 = 10
    ["AS", "AC", "AD"], // 1 + 1 + 1 = 3
    ["6S", "5C", "JD"], // 6 + 5 + 9 = 20
    ["4S", "QC", "3D", "4H"], // 4 + 8 + 3 + 4 = 19
    ["5S", "7C", "7D"], // 5 + 7 + 7 = 19
    ["AS", "5C", "2D"], // 1 + 5 + 2 = 8
    ["4S", "QC", "6D"], // 4 + 8 + 6 = 18
    ["JS", "6C", "AD"], // 9 + 6 + 1 = 16
    ["4S", "4C", "4D", "4H", "AS"], // 4 + 4 + 4 + 4 + 1 = 17
    ["2S", "3C", "7D", "AD", "AS"], // 2 + 3 + 7 + 1 + 1 = 14
    ["AS", "2S", "2C", "2D", "2H", "3S", "5D"], // 1 + 2 + 2 + 2 + 2 + 3 + 5 = 17
  ] satisfies CardCode[][])(
    "should return false when sum is not 15",
    (...cardsCodes) => {
      // Act
      const result = willSumToFifteen(cardsCodes);
      // Assert
      expect(result).toBe(false);
    }
  );
});
