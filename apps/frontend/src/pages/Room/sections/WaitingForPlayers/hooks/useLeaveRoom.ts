import { useMutation } from "react-query";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  axiosInstance,
  handleRequestError,
} from "../../../../../resources/api";

export function useLeaveRoom() {
  const [room] = useRoom();
  const [playerId] = usePlayerId();

  async function deleteRequest() {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.delete(`/room/${room.id}/leave`, {
      params: { playerId },
    });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("leaveRoom", deleteRequest);

  const leaveRoom = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      handleRequestError(error, "Failed to leave room");
    }
  };

  return { leaveRoom, ...rest };
}
