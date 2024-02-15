import { useMutation } from "react-query";

import { KickPlayerDtoType } from "shared-code";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  axiosInstance,
  handleRequestError,
} from "../../../../../resources/api";

export function useKickPlayer() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();

  async function deleteRequest({
    kickedPlayerNick,
  }: Pick<KickPlayerDtoType, "kickedPlayerNick">) {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.delete(
      `/room/${room.id}/kick-player`,
      {
        data: { playerId, kickedPlayerNick } satisfies KickPlayerDtoType,
      }
    );

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("kickPlayer", deleteRequest);

  const kickPlayer = async (kickedPlayerNick: string) => {
    try {
      await mutateAsync({ kickedPlayerNick });
    } catch (error) {
      handleRequestError(error, "Unable to kick player");
    }
  };

  return { kickPlayer, ...rest };
}
