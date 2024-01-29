import { GetRoomResponseDto, Room } from "shared-code";
import { LOCAL_ROOM_ID } from "../resources/constants";

export const isRoomLocal = (room?: Room | GetRoomResponseDto) =>
  room?.id === LOCAL_ROOM_ID;
