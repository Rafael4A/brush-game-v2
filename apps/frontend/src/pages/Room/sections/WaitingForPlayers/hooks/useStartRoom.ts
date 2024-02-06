import { useMutation } from "react-query";

import { BasicRoomResponseDto, StartGameDto } from "shared-code";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  axiosInstance,
  handleRequestError,
} from "../../../../../resources/api";

export function useStartRoom() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();

  async function post(): Promise<BasicRoomResponseDto> {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.post(`/room/${room.id}/start-game`, {
      playerId,
    } satisfies StartGameDto);

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("startRoom", post);

  const startRoom = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      handleRequestError(error, "Unable to start game");
    }
  };

  return { startRoom, ...rest };
}
