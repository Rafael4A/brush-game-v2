import { shuffleCards } from "../../../code";
import { CardCode } from "../../../types";

describe("shuffleCards tests", () => {
  it("should return an array with the same length as the input array", () => {
    // Arrange
    const unshuffled: CardCode[] = ["AS", "2S", "3S", "4S", "5S"];
    // Act
    const result = shuffleCards(unshuffled);
    // Assert
    expect(result).toHaveLength(unshuffled.length);
  });

  it("should return an array with the same elements as the input array", () => {
    // Arrange
    const unshuffled: CardCode[] = ["AS", "2S", "3S", "4S", "5S"];
    // Act
    const result = shuffleCards(unshuffled);
    // Assert
    expect(result).toEqual(expect.arrayContaining(unshuffled));
  });
});
