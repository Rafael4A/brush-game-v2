import { GetRoomResponseDto } from "shared-code";

import { createGlobalState } from "./base/createGlobalState";

import { useGetRoom } from "../hooks";
import { useEffect } from "react";

const [_useRoom, RoomProvider] = createGlobalState<
  GetRoomResponseDto | undefined
>(undefined);

const useRoom = (
  id?: string
): [
  GetRoomResponseDto | undefined,
  React.Dispatch<React.SetStateAction<GetRoomResponseDto | undefined>>,
] => {
  const { data } = useGetRoom(id);

  const [_room, _setRoom] = _useRoom();

  // This is effect is only needed because the room needs to be mutable but update when refetched
  useEffect(() => {
    if (id && data) {
      _setRoom(data);
    }
  }, [id, data]);

  return [_room, _setRoom];
};

export { useRoom, RoomProvider };
