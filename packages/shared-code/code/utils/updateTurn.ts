import { Room } from "../../types";
import { nextTurnIndex } from "./nextTurnIndex";

export function updateTurn(room: Room) {
  const nextPlayerIndex = nextTurnIndex(
    room.players.findIndex((player) => player.nickname === room.currentTurn),
    room.players.length
  );
  return { ...room, currentTurn: room.players[nextPlayerIndex].nickname };
}
