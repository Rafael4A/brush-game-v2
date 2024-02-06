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
    try {
      if (!room) throw new Error("Room data not found");
      const updatedRoom = await mutateAsync({
        playerId,
        cardCode,
        tableCardCodes,
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

  let result;

  switch (gameType) {
    case GameTypes.Online:
      result = {
        playCards: playServerCards,
        ...rest,
      };
      break;
    case GameTypes.Local:
      result = { playCards: playLocalCards, isLoading: false };
      break;
    case GameTypes.Tutorial:
    default:
      throw new Error("Tutorial game type is not supported");
  }

  return result;
}
