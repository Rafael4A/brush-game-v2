import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { GetRoomResponseDto, ROUTES } from "shared-code";

import { usePlayerId } from "../context";
import {
  RequestError,
  axiosInstance,
  handleRequestError,
} from "../resources/api";

export function useGetRoom(roomId?: string) {
  const navigate = useNavigate();

  const [playerId] = usePlayerId();

  async function get(): Promise<GetRoomResponseDto> {
    try {
      if (!roomId || !playerId) {
        navigate(ROUTES.HOME);
        throw new Error("Room or player id is missing");
      }

      const response = await axiosInstance.get(`/room/${roomId}`, {
        params: { playerId },
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;
        if (response?.data.statusCode === 404) {
          toast.error("Room not found");
          navigate(ROUTES.HOME);
          throw error;
        }
        if (
          response?.data.message ===
          "This player cannot access the requested room"
        ) {
          toast.error("You don't have access to this room");
          navigate(ROUTES.HOME);
          throw error;
        }
      }
      handleRequestError(error, "Unable to get room information");
      throw error;
    }
  }

  return useQuery({
    queryKey: ["room", roomId, playerId],
    queryFn: () => get(),
    enabled: !!roomId,
  });
}
