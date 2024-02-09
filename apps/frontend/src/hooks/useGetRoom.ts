import { useNavigate } from "react-router-dom";
import { usePlayerId } from "../context";
import {
  RequestError,
  axiosInstance,
  handleRequestError,
} from "../resources/api";

import { useQuery } from "react-query";
import { GetRoomResponseDto } from "shared-code";
import { toast } from "react-toastify";
import { AxiosError, isAxiosError } from "axios";

export function useGetRoom(roomId?: string) {
  const navigate = useNavigate();

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

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;
        if (
          response?.data.message ===
          "This player cannot access the requested room"
        ) {
          toast.error("You don't have access to this room");
          navigate(`/`);
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
