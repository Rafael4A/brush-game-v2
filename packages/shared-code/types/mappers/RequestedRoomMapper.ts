import { Room } from "../room";
import { GetRoomResponseDto } from "../room-dtos";
import { PlayerToOpponentMapper } from "./PlayerToOpponentMapper";

export class RequestedRoomMapper {
  static map(room: Room, playerId: string): GetRoomResponseDto {
    return {
      id: room.id,
      currentTurn: room.currentTurn,
      gameState: room.gameState,
      player: room.players.find((p) => p.id === playerId)!,
      remainingCards: room.cards.length,
      table: room.table,
      opponents: room.players
        .filter((p) => p.id !== playerId)
        .map(PlayerToOpponentMapper.map),
    };
  }
}
