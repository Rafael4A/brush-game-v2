import { GetRoomResponseDto } from "shared-types";

import { createGlobalState } from "./base/createGlobalState";

export const [useRoom, RoomProvider] = createGlobalState<
  GetRoomResponseDto | undefined
>(undefined);
