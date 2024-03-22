import { updateTurn } from "../../../code";
import { IN_GAME_ROOM_STUB } from "../../utils";

describe("updateTurn tests", () => {
  it("should update turn correctly when there is a next player", () => {
    // Act
    const result = updateTurn(IN_GAME_ROOM_STUB);
    // Assert
    expect(result.currentTurn).toBe("Player 2");
  });

  it("should update turn correctly when there is not a next player", () => {
    // Arrange
    const firstTurnNickname = IN_GAME_ROOM_STUB.currentTurn;
    // Act
    const secondTurn = updateTurn(IN_GAME_ROOM_STUB);
    const thirdTurn = updateTurn(secondTurn);
    // Assert
    expect(thirdTurn.currentTurn).toBe(firstTurnNickname);
  });
});
