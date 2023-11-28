import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { GetRoomResponseDto, PlayCardDtoType } from "shared-types";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

interface PlayCardProps extends PlayCardDtoType {
  id: string;
}

export function usePlayCards() {
  const [playerId] = usePlayerId();
  const [room, setRoom] = useRoom();

  async function post({
    id,
    playerId,
    cardCode,
    tableCardCodes,
  }: PlayCardProps): Promise<GetRoomResponseDto> {
    const response = await axiosInstance.post(`/room/${id}/play-card`, {
      playerId,
      cardCode,
      tableCardCodes,
    });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("playCards", post);

  const playCards = async (cardCode: string, tableCardCodes: string[]) => {
    try {
      if (!room) throw new Error("Room data not found");
      const updatedRoom = await mutateAsync({
        id: room.id,
        playerId,
        cardCode,
        tableCardCodes,
      });

      setRoom(updatedRoom);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to play card");
      }
    }
  };

  return { playCards, ...rest };
}
