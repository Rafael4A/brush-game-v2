import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetRoomResponseDto } from "shared-types";

import { usePlayerId, useRoom } from "../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../resources/api";

export function useGetRoom(roomId: string) {
  const navigate = useNavigate();
  const [, setRoom] = useRoom();
  const [playerId] = usePlayerId();

  async function get(): Promise<GetRoomResponseDto> {
    try {
      if (!roomId || !playerId) {
        navigate(`/`);
        throw new Error("Room or player id is missing");
      }

      const response = await axiosInstance.get(`/room/${roomId}`, {
        params: { playerId },
      });

      setRoom(response.data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        if (response?.status === 404) {
          navigate(`/room/not-found`);
        }

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to get room information");
      }
      throw error;
    }
  }

  return useQuery(["room", roomId, playerId], () => get());
}
