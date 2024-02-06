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

  let getFn;

  switch (gameType) {
    case GameTypes.Online:
      getFn = getRemote;
      break;
    case GameTypes.Local:
      getFn = getLocal;
      break;
    case GameTypes.Tutorial:
      throw new Error("Tutorial game type is not supported");
  }

  return useQuery({
    queryKey: ["report", room?.id, playerId],
    queryFn: getFn,
    enabled: gameType === GameTypes.Online,
  });
}
