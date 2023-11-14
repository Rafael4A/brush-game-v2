import {
  Card,
  BasicRoomResponseDto,
  GameState,
  GetRoomResponseDto,
  Opponent,
  Player,
} from "shared-types";

export interface Room {
  id: string;
  creationDate: Date;
  cards: Card[];
  table: Card[];
  players: Player[];
  firstPlayerIndex?: string;
  currentTurn?: string;
  gameState: GameState;
}

export class BasicRoomMapper {
  static map(room: Room, playerId: string): BasicRoomResponseDto {
    return {
      id: room.id,
      playerId,
    };
  }
}

export class RequestedRoomMapper {
  static map(room: Room, playerId: string): GetRoomResponseDto {
    return {
      id: room.id,
      currentTurn: room.currentTurn,
      gameState: room.gameState,
      player: room.players.find((p) => p.id === playerId),
      remainingCards: room.cards.length,
      table: room.table,
      opponents: room.players
        .filter((p) => p.id !== playerId)
        .map(PlayerToOpponentMapper.map),
    };
  }
}

export class PlayerToOpponentMapper {
  static map(player: Player): Opponent {
    return {
      nickname: player.nickname,
      previousPoints: player.previousPoints,
      isOwner: player.isOwner,
    };
  }
}
