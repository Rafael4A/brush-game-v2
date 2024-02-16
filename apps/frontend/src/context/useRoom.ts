import { useEffect } from "react";

import { useParams } from "react-router-dom";

import { GetRoomResponseDto, RequestedRoomMapper } from "shared-code";

import { GameTypes, useGameType } from ".";

import { useGetRoom } from "../hooks";
import { LOCAL_PLAYER_ID } from "../resources/constants";
import { createGlobalState } from "./base/createGlobalState";
import { useLocalRoom } from "./useLocalRoom";

const [_useRoom, RoomProvider] = createGlobalState<
  GetRoomResponseDto | undefined
>(undefined);

const useRoom = (): [
  GetRoomResponseDto | undefined,
  React.Dispatch<React.SetStateAction<GetRoomResponseDto | undefined>>,
] => {
  const { id } = useParams();
  const { data } = useGetRoom(id);
  const [localRoom] = useLocalRoom();
  const [gameType] = useGameType();

  const [_room, _setRoom] = _useRoom();

  useEffect(() => {
    // This is effect is only needed because the room needs to be mutable but update when refetched
    if (id && data && gameType === GameTypes.Online) {
      _setRoom(data);
    } else if (localRoom && gameType === GameTypes.Local) {
      _setRoom(RequestedRoomMapper.map(localRoom, LOCAL_PLAYER_ID));
    }
  }, [id, data, localRoom, _setRoom, gameType]);

  return [_room, _setRoom];
};

export { useRoom, RoomProvider };
