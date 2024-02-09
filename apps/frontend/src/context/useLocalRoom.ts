import { GameState, Room } from "shared-code";

import { createGlobalStorageState } from "./base/createGlobalStorageState";
import {
  LOCAL_COMPUTER_NICK,
  LOCAL_STORAGE_KEYS,
} from "../resources/constants";
import { playComputerCard } from "../gameLogic";
import { nextGameState } from "shared-code/code/nextGameState";

const [_useLocalRoom, LocalRoomProvider] = createGlobalStorageState<
  Room | undefined
>(LOCAL_STORAGE_KEYS.LOCAL_ROOM, undefined);

const useLocalRoom = (): [Room | undefined, (room: Room) => void] => {
  const [localRoom, _setLocalRoom] = _useLocalRoom();

  const setLocalRoomWithSideEffects = (room: Room) => {
    if (
      room.currentTurn === LOCAL_COMPUTER_NICK &&
      nextGameState(room) === GameState.Playing
    ) {
      _setLocalRoom(room);
      const [computerCard, roomAfterComputerMove] = playComputerCard(room);

      const roomWithComputerCard = {
        ...room,
        table: [computerCard, ...room.table],
      };

      const delay =
        roomAfterComputerMove.table.length === roomWithComputerCard.table.length
          ? 300
          : 650;

      setTimeout(() => {
        _setLocalRoom(roomWithComputerCard);

        setTimeout(() => {
          _setLocalRoom(roomAfterComputerMove);
        }, 10);
      }, delay);
    } else {
      _setLocalRoom(room);
    }
  };

  return [localRoom, setLocalRoomWithSideEffects];
};

export { useLocalRoom, LocalRoomProvider };
