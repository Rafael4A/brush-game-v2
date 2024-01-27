import { GetRoomResponseDto } from "shared-code";

import { createGlobalState } from "./base/createGlobalState";

export const [useRoom, RoomProvider] = createGlobalState<
  GetRoomResponseDto | undefined
>(undefined);
