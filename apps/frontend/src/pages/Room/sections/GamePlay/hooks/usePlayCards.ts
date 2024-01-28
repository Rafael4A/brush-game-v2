import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { CardCode, GetRoomResponseDto, PlayCardDtoType } from "shared-code";

import { usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

export function usePlayCards() {
  const [playerId] = usePlayerId();
  const [room, setRoom] = useRoom();

  async function post({
    playerId,
    cardCode,
    tableCardCodes,
  }: PlayCardDtoType): Promise<GetRoomResponseDto> {
    if (!room || !playerId) throw new Error("Room or player id is missing");

    const response = await axiosInstance.post(`/room/${room.id}/play-card`, {
      playerId,
      cardCode,
      tableCardCodes,
    });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("playCards", post);

  const playCards = async (cardCode: CardCode, tableCardCodes: CardCode[]) => {
    try {
      if (!room) throw new Error("Room data not found");
      const updatedRoom = await mutateAsync({
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
