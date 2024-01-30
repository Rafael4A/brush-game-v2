import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { PlayerReport, generateReport } from "shared-code";

import { useLocalRoom, usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

export function useGetReport(isLocal?: boolean) {
  const [room] = useRoom();
  const [playerId] = usePlayerId();
  const [localRoom] = useLocalRoom();

  async function get(): Promise<PlayerReport[]> {
    try {
      if (!room || !playerId) throw new Error("Room or player id is missing");

      const response = await axiosInstance.get(`/room/${room.id}/report`, {
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

  async function getLocal(): Promise<PlayerReport[]> {
    if (!localRoom) throw new Error("Local room is missing");
    return Promise.resolve(generateReport(localRoom));
  }
  return useQuery(["report", room?.id, playerId], () =>
    isLocal ? getLocal() : get()
  );
}
