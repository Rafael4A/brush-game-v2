import { useNavigate } from "react-router-dom";
import { usePlayerId } from "../context";
import { axiosInstance, handleRequestError } from "../resources/api";

import { useQuery } from "react-query";
import { GetRoomResponseDto } from "shared-code";

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
