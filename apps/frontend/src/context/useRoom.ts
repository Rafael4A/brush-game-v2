import { useEffect } from "react";

import { GetRoomResponseDto, RequestedRoomMapper } from "shared-code";

import { useGetRoom } from "../hooks";
import { LOCAL_PLAYER_ID } from "../resources/constants";
import { createGlobalState } from "./base/createGlobalState";
import { useLocalRoom } from "./useLocalRoom";

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
  const [localRoom] = useLocalRoom();

  const [_room, _setRoom] = _useRoom();

  useEffect(() => {
    // This is effect is only needed because the room needs to be mutable but update when refetched
    if (id && data) {
      _setRoom(data);
    } else if (localRoom) {
      _setRoom(RequestedRoomMapper.map(localRoom, LOCAL_PLAYER_ID));
    }
  }, [id, data, localRoom, _setRoom]);

  return [_room, _setRoom];
};

export { useRoom, RoomProvider };
