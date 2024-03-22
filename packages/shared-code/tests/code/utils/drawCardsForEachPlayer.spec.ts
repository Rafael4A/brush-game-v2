import { drawCardsForEachPlayer } from "../../../code";
import { Room } from "../../../types";
import { generatePlayerStub } from "../../utils";
import { INITIAL_ROOM_STUB } from "../../utils/ROOM_STUB";

describe("drawCardsForEachPlayer tests", () => {
  it("should draw 3 cards for each player", () => {
    // Arrange
    const room: Room = {
      ...INITIAL_ROOM_STUB,
      players: [generatePlayerStub(), generatePlayerStub({}, 2)],
    };

    // Act
    const result = drawCardsForEachPlayer(room.players, room.cards);
    // Assert
    for (const player of result.players) {
      expect(player.cards).toHaveLength(3);
    }
    const cardsDrawnPerPlayerCount = 3;
    const expectedRemainingCardsCount =
      room.cards.length - cardsDrawnPerPlayerCount * room.players.length;
    expect(result.remainingCards).toHaveLength(expectedRemainingCardsCount);
  });
});
