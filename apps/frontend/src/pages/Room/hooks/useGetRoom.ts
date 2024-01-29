import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetRoomResponseDto, RequestedRoomMapper } from "shared-code";

import { useLocalRoom, usePlayerId, useRoom } from "../../../context";
import {
  RequestError,
  axiosInstance,
  getRequestErrorMessage,
} from "../../../resources/api";
import { LOCAL_PLAYER_ID } from "../../../resources/constants";

export function useGetRoom(roomId?: string, isLocal?: boolean) {
  const navigate = useNavigate();
  const [, setRoom] = useRoom();
  const [playerId] = usePlayerId();
  const [localRoom] = useLocalRoom();

  async function get(): Promise<GetRoomResponseDto> {
    try {
      if (!roomId || !playerId) {
        navigate(`/`);
        throw new Error("Room or player id is missing");
      }

      const response = await axiosInstance.get(`/room/${roomId}`, {
        params: { playerId },
      });

      setRoom(response.data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<RequestError>;

        if (response?.status === 404) {
          navigate(`/room/not-found`);
        }

        toast.error(getRequestErrorMessage(response?.data));
      } else {
        toast.error("Unable to get room information");
      }
      throw error;
    }
  }

  async function getLocal(): Promise<GetRoomResponseDto> {
    if (!localRoom) throw new Error("Local room is missing");
    const clientRoom = RequestedRoomMapper.map(localRoom, LOCAL_PLAYER_ID);
    setRoom(clientRoom);
    return Promise.resolve(clientRoom);
  }

  return useQuery(["room", roomId, playerId], () =>
    isLocal ? getLocal() : get()
  );
}
