import { AxiosError, isAxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  CardCode,
  GetRoomResponseDto,
  PlayCardDtoType,
  playCard,
} from "shared-code";

import { useLocalRoom, usePlayerId, useRoom } from "../../../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../../../resources/api";

import { isRoomLocal } from "../../../../../utils";

export function usePlayCards() {
  const [playerId] = usePlayerId();
  const [room, setRoom] = useRoom();
  const [localRoom, setLocalRoom] = useLocalRoom();

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

  const playServerCards = async (
    cardCode: CardCode,
    tableCardCodes: CardCode[]
  ) => {
    console.log("remote");

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

  const playLocalCards = (cardCode: CardCode, tableCardCodes: CardCode[]) => {
    console.log("local");
    try {
      if (!room || !localRoom) throw new Error("Room data not found");
      const updatedRoom = playCard(
        localRoom,
        playerId,
        cardCode,
        tableCardCodes
      );
      console.log("local2");

      // TODO COMPUTER MOVE
      setLocalRoom(updatedRoom);
      //setRoom(RequestedRoomMapper.map(updatedRoom, LOCAL_PLAYER_ID));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to play card");
      }
    }
  };

  return {
    playCards: isRoomLocal(room) ? playLocalCards : playServerCards,
    ...rest,
  };
}
