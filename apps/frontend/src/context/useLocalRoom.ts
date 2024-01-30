import { GameState, RequestedRoomMapper, Room } from "shared-code";

import { createGlobalStorageState } from "./base/createGlobalStorageState";
import { useRoom } from "./useRoom";
import { LOCAL_COMPUTER_NICK, LOCAL_PLAYER_ID } from "../resources/constants";
import { playComputerCard } from "../gameLogic";
import { nextGameState } from "shared-code/code/nextGameState";

const [_useLocalRoom, LocalRoomProvider] = createGlobalStorageState<
  Room | undefined
>("local-room", undefined);

const useLocalRoom = (): [Room | undefined, (room: Room) => void] => {
  const [localRoom, _setLocalRoom] = _useLocalRoom();

  const [, setRoom] = useRoom();

  const setLocalRoomWithSideEffects = (room: Room) => {
    if (
      room.currentTurn === LOCAL_COMPUTER_NICK &&
      nextGameState(room) === GameState.Playing
    ) {
      setLocalRoomWithNoEffects(room);
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
        setLocalRoomWithNoEffects(roomWithComputerCard);

        setTimeout(() => {
          setLocalRoomWithNoEffects(roomAfterComputerMove);
        }, 10);
      }, delay);
    } else {
      setLocalRoomWithNoEffects(room);
    }
  };

  const setLocalRoomWithNoEffects = (room: Room) => {
    _setLocalRoom(room);
    setRoom(RequestedRoomMapper.map(room, LOCAL_PLAYER_ID));
  };

  return [localRoom, setLocalRoomWithSideEffects];
};

export { useLocalRoom, LocalRoomProvider };
