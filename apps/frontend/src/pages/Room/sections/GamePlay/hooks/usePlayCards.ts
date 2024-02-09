import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  CardCode,
  GetRoomResponseDto,
  PlayCardDtoType,
  playCard,
} from "shared-code";

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

export function usePlayCards() {
  const [playerId] = usePlayerId();
  const [room, setRoom] = useRoom();
  const [localRoom, setLocalRoom] = useLocalRoom();
  const [gameType] = useGameType();

  const { mutateAsync, ...rest } = useMutation("playCards", post);

  const playServerCards = async (
    cardCode: CardCode,
    tableCardCodes: CardCode[]
  ) => {
    try {
      if (!room) throw new Error("Room data not found");
      const updatedRoom = await mutateAsync({
        playerId,
        cardCode,
        tableCardCodes,
        roomId: room.id,
      });

      setRoom(updatedRoom);
    } catch (error) {
      handleRequestError(error, "Unable to play card");
    }
  };

  const playLocalCards = (cardCode: CardCode, tableCardCodes: CardCode[]) => {
    try {
      if (!room || !localRoom) throw new Error("Room data not found");
      const roomAfterPlayerMove = playCard(
        localRoom,
        playerId,
        cardCode,
        tableCardCodes
      );

      setLocalRoom(roomAfterPlayerMove);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to play card");
      }
    }
  };

  if (gameType === GameTypes.Online)
    return {
      playCards: playServerCards,
      ...rest,
    };
  else return { playCards: playLocalCards, isLoading: false };
}

interface PlayCardPostArgs extends PlayCardDtoType {
  roomId: string;
}

async function post({
  playerId,
  cardCode,
  tableCardCodes,
  roomId,
}: PlayCardPostArgs): Promise<GetRoomResponseDto> {
  if (!roomId || !playerId) throw new Error("Room or player id is missing");

  const response = await axiosInstance.post(`/room/${roomId}/play-card`, {
    playerId,
    cardCode,
    tableCardCodes,
  });

  return response.data;
}
