import { drawCardsIfPossible } from "../../../code";
import { Room } from "../../../types";
import { IN_GAME_ROOM_STUB } from "../../utils";

describe("drawCardsIfPossible tests", () => {
  it("should draw a card when player has no cards and there are still cards to be drawn", () => {
    // Arrange
    const room: Room = {
      ...IN_GAME_ROOM_STUB,
      players: [{ ...IN_GAME_ROOM_STUB.players[0], cards: [] }],
    };
    const player = room.players[0];
    // Act
    const result = drawCardsIfPossible(room, player);
    // Assert
    const drawnCardsCount = 3;
    const expectedRoomCardsCount = room.cards.length - drawnCardsCount;

    expect(result.players[0].cards).toHaveLength(drawnCardsCount);
    expect(result.cards).toHaveLength(expectedRoomCardsCount);
  });

  it("should not draw a card when player has cards", () => {
    // Arrange
    const room = IN_GAME_ROOM_STUB;
    const player = room.players[0];
    // Act
    const result = drawCardsIfPossible(room, player);
    // Assert
    expect(result.players[0].cards).toHaveLength(room.players[0].cards.length);
    expect(result.cards).toHaveLength(room.cards.length);
  });

  it("should not draw a card when there are no cards to be drawn", () => {
    // Arrange
    const room: Room = {
      ...IN_GAME_ROOM_STUB,
      players: [{ ...IN_GAME_ROOM_STUB.players[0], cards: [] }],
      cards: [],
    };
    const player = room.players[0];
    // Act
    const result = drawCardsIfPossible(room, player);
    // Assert
    expect(result.players[0].cards).toHaveLength(room.players[0].cards.length);
    expect(result.cards).toHaveLength(room.cards.length);
  });
});
