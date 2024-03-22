import { Player } from "../../types";

export function generatePlayerStub(
  properties: Partial<Player> = {},
  playerNumber: number = 1
) {
  return {
    id: `p${playerNumber}`,
    nickname: `Player ${playerNumber}`,
    cards: [],
    collectedCards: [],
    currentBrushCount: 0,
    isOwner: playerNumber === 1,
    previousPoints: 0,
    ...properties,
  };
}
