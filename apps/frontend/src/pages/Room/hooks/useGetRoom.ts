import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetRoomResponseDto } from "shared-types";

import { useRoom } from "../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../resources/api";

interface GetRoomProps {
  id: string;
  playerId: string;
}

export function useGetRoom(id: string, playerId: string) {
  const navigate = useNavigate();
  const [, setRoom] = useRoom();

  async function get({
    id,
    playerId,
  }: GetRoomProps): Promise<GetRoomResponseDto> {
    try {
      const response = await axiosInstance.get(`/room/${id}`, {
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

  return useQuery(["room", id, playerId], () => get({ id, playerId }));
}
