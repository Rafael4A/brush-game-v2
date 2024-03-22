import { Room } from "../types";
import { nextGameState } from "./nextGameState";
import { drawCardsIfPossible, updateTurn } from "./utils";

export function handleTurnEnd(room: Room, playerId: string): Room {
  const player = room.players.find((p) => p.id === playerId)!;

  const roomAfterDraw = drawCardsIfPossible(room, player);

  const roomAfterTurnUpdate = updateTurn(roomAfterDraw);

  const finalRoom = {
    ...roomAfterTurnUpdate,
    gameState: nextGameState(roomAfterTurnUpdate),
  };

  return finalRoom;
}
