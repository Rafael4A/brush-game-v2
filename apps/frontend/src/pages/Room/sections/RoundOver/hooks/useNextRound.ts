import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, StartGameDto, nextRound } from "shared-code";

import { useLocalRoom, usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

export function useNextRound(isLocal?: boolean) {
  const [room] = useRoom();
  const [localRoom, setLocalRoom] = useLocalRoom();
  const [playerId] = usePlayerId();

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
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to start next round");
      }
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

  return { nextRound: isLocal ? nextLocalRound : nextRemoteRound, ...rest };
}
