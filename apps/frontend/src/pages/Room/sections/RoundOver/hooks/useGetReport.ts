import { useQuery } from "react-query";

import { PlayerReport, generateReport } from "shared-code";

import {
  GameTypes,
  useGameType,
  useLocalRoom,
  usePlayerId,
  useRoom,
} from "../../../../../context";
import {
  axiosInstance,
  handleRequestError,
} from "../../../../../resources/api";

export function useGetReport() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();
  const [localRoom] = useLocalRoom();
  const [gameType] = useGameType();

  async function getRemote(): Promise<PlayerReport[]> {
    try {
      if (!room || !playerId) throw new Error("Room or player id is missing");

      const response = await axiosInstance.get(`/room/${room.id}/report`, {
        params: { playerId },
      });

      return response.data;
    } catch (error) {
      handleRequestError(error, "Unable to get report information");

      throw error;
    }
  }

  async function getLocal(): Promise<PlayerReport[]> {
    if (!localRoom) throw new Error("Local room is missing");
    return Promise.resolve(generateReport(localRoom));
  }

  return useQuery({
    queryKey: ["report", room?.id, playerId],
    queryFn: gameType === GameTypes.Online ? getRemote : getLocal,
  });
}
