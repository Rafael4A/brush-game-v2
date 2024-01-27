import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, NewRoomDtoType } from "shared-code";

import { usePlayerId } from "../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../resources/api";

export function useCreateRoom() {
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();

  async function post({
    nickname,
  }: NewRoomDtoType): Promise<BasicRoomResponseDto> {
    const response = await axiosInstance.post("/room", { nickname });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("createRoom", post);

  const createRoom = async (nickname: string) => {
    try {
      const { id, playerId } = await mutateAsync({ nickname });
      setPlayerId(playerId);
      navigate(`/room/${id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to create room");
      }
    }
  };

  return { createRoom, ...rest };
}
