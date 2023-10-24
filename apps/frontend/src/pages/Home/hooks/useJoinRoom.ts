import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BasicRoomResponseDto, NewRoomDtoType } from "shared-types";

import { usePlayerId } from "../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../resources/api";

interface JoinRoomProps extends NewRoomDtoType {
  id: string;
}

export function useJoinRoom() {
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();
  async function post({
    nickname,
    id,
  }: JoinRoomProps): Promise<BasicRoomResponseDto> {
    const response = await axiosInstance.post(`/room/${id}/join`, { nickname });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("joinRoom", post);

  const joinRoom = async (nickname: string, roomId: string) => {
    try {
      const { id, playerId } = await mutateAsync({ nickname, id: roomId });
      setPlayerId(playerId);
      navigate(`/room/${id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to join room");
      }
    }
  };

  return { joinRoom, ...rest };
}
