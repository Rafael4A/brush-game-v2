import { getSummableCards } from "../../../code/utils";
import { CardCode } from "../../../types";

describe("getSummableCards tests", () => {
  it("should return an empty array if no summable cards are present", () => {
    // Arrange
    const cards: CardCode[] = ["QC", "JD", "JH", "KS"];
    // Act
    const result = getSummableCards(cards);
    // Assert
    expect(result).toEqual([]);
  });

  it("should filter summable cards correctly", () => {
    // Arrange
    const cards: CardCode[] = ["QC", "JD", "JH", "KS", "2C"];
    // Act
    const result = getSummableCards(cards);
    // Assert
    expect(result).toEqual(["2C"]);
  });

  it("should filter summable cards correctly when there are multiple summable cards", () => {
    // Arrange
    const cards: CardCode[] = ["QC", "JD", "JH", "KS", "2C", "3D", "4H"];
    // Act
    const result = getSummableCards(cards);
    // Assert
    expect(result).toEqual(expect.arrayContaining(["2C", "3D", "4H"]));
  });

  it("should filter summable cards correctly when there are multiple summable cards of the same suit", () => {
    // Arrange
    const cards: CardCode[] = [
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
    ];
    // Act
    const result = getSummableCards(cards);
    // Assert
    expect(result).toEqual(expect.arrayContaining(["5H", "4C", "7D", "6S"]));
  });
});
