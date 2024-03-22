import { drawCards } from "../../../code";
import { CardCode } from "../../../types";

describe("drawCards", () => {
  it("should draw the specified number of cards", () => {
    const cards: CardCode[] = ["2C", "3D", "4H", "5S", "6C"];
    const drawCount = 3;

    const result = drawCards(cards, drawCount);

    expect(result.drawn).toHaveLength(drawCount);
    expect(result.remainingCards).toHaveLength(cards.length - drawCount);
  });

  it("should return an empty array if drawCount is 0", () => {
    const cards: CardCode[] = ["2C", "3D", "4H", "5S", "6C"];
    const drawCount = 0;

    const result = drawCards(cards, drawCount);

    expect(result.drawn).toHaveLength(0);
    expect(result.remainingCards).toHaveLength(cards.length);
  });

  it("should return all cards if drawCount is greater than the number of cards", () => {
    const cards: CardCode[] = ["2C", "3D", "4H", "5S", "6C"];
    const drawCount = 10;

    const result = drawCards(cards, drawCount);

    expect(result.drawn).toHaveLength(cards.length);
    expect(result.remainingCards).toHaveLength(0);
  });
});
