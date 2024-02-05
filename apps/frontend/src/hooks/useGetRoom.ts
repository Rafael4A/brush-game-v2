import { useNavigate } from "react-router-dom";
import { usePlayerId } from "../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../resources/api";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "react-toastify";
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

  return useQuery({
    queryKey: ["room", roomId, playerId],
    queryFn: () => get(),
    enabled: !!roomId,
  });
}
