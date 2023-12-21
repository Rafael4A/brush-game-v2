import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { PlayerReport } from "shared-types";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

interface GetRoomProps {
  id: string;
  playerId: string;
}

export function useGetReport() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();

  if (!room || !playerId) {
    throw new Error("Room or player id is missing");
  }

  async function get({ id, playerId }: GetRoomProps): Promise<PlayerReport[]> {
    try {
      const response = await axiosInstance.get(`/room/${id}/report`, {
        params: { playerId },
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to get report information");
      }
      throw error;
    }
  }

  return useQuery(["report", room.id, playerId], () =>
    get({ id: room.id, playerId })
  );
}
