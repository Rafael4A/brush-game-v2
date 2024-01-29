import { BasicRoomResponseDto, Room } from "shared-code";

export class BasicRoomMapper {
  static map(room: Room, playerId: string): BasicRoomResponseDto {
    return {
      id: room.id,
      playerId,
    };
  }
}
