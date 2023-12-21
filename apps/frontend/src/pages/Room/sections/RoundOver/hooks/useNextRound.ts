import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, StartGameDto } from "shared-types";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

export function useNextRound() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();

  async function post(): Promise<BasicRoomResponseDto> {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.post(`/room/${room.id}/next-round`, {
      playerId,
    } satisfies StartGameDto);

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("nextRound", post);

  const nextRound = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to start game");
      }
    }
  };

  return { nextRound, ...rest };
}
