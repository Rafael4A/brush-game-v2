import { GameState, Room } from "../types";
import { generateReport } from "./generateReport";

export function nextGameState(room: Room) {
  const totalRemainingCards =
    room.cards.length +
    room.players.reduce((acc, p) => acc + p.cards.length, 0);

  if (totalRemainingCards === 0) {
    const report = generateReport(room);

    return report.some((r) => r.currentPoints >= 15)
      ? GameState.GameOver
      : GameState.RoundOver;
  } else {
    return room.gameState;
  }
}
