import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, StartGameDto, nextRound } from "shared-code";

import {
  GameTypes,
  useGameType,
  useLocalRoom,
  usePlayerId,
  useRoom,
} from "../../../../../context";
import {
  axiosInstance,
  handleRequestError,
} from "../../../../../resources/api";

export function useNextRound() {
  const [room] = useRoom();
  const [localRoom, setLocalRoom] = useLocalRoom();
  const [playerId] = usePlayerId();
  const [gameType] = useGameType();
  async function post(): Promise<BasicRoomResponseDto> {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.post(`/room/${room.id}/next-round`, {
      playerId,
    } satisfies StartGameDto);

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("nextRound", post);

  const nextRemoteRound = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      handleRequestError(error, "Unable to start next round");
    }
  };

  const nextLocalRound = async () => {
    try {
      if (!localRoom) throw new Error("Local room is missing");
      setLocalRoom(nextRound(localRoom, playerId));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to start next round");
      }
    }
  };

  switch (gameType) {
    case GameTypes.Online:
      return { nextRound: nextRemoteRound, ...rest };

    case GameTypes.Local:
      return { nextRound: nextLocalRound, isLoading: false };

    case GameTypes.Tutorial:
    default:
      throw new Error("Tutorial game type is not supported");
  }
}
