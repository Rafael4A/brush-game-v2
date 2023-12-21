import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, StartGameDto } from "shared-types";

import { usePlayerId } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

interface StartRoomProps extends StartGameDto {
  id: string;
}

export function useStartRoom() {
  const [playerId] = usePlayerId();

  async function post({
    id,
    playerId,
  }: StartRoomProps): Promise<BasicRoomResponseDto> {
    const response = await axiosInstance.post(`/room/${id}/start-game`, {
      playerId,
    });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("startRoom", post);

  const startRoom = async (id: string) => {
    try {
      await mutateAsync({ id, playerId });
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to start game");
      }
    }
  };

  return { startRoom, ...rest };
}
