import { RequestedRoomMapper, Room } from "shared-code";

import { createGlobalStorageState } from "./base/createGlobalStorageState";
import { useRoom } from ".";
import { LOCAL_PLAYER_ID } from "../resources/constants";

const [_useLocalRoom, LocalRoomProvider] = createGlobalStorageState<
  Room | undefined
>("local-room", undefined);

const useLocalRoom = (): [Room | undefined, (room: Room) => void] => {
  const [localRoom, _setLocalRoom] = _useLocalRoom();
  const [, setRoom] = useRoom();
  const setLocalRoom = (room: Room) => {
    _setLocalRoom(room);
    setRoom(RequestedRoomMapper.map(room, LOCAL_PLAYER_ID));
  };

  return [localRoom, setLocalRoom];
};

export { useLocalRoom, LocalRoomProvider };
