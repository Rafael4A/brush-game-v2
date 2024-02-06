import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { BasicRoomResponseDto, NewRoomDtoType } from "shared-code";

import { usePlayerId } from "../../../context";
import { axiosInstance, handleRequestError } from "../../../resources/api";

interface JoinRoomProps extends NewRoomDtoType {
  id: string;
}

export function useJoinRoom() {
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();

  async function post({
    nickname,
    id,
  }: JoinRoomProps): Promise<BasicRoomResponseDto> {
    const response = await axiosInstance.post(`/room/${id}/join`, { nickname });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("joinRoom", post);

  const joinRoom = async (nickname: string, roomId: string) => {
    try {
      const { id, playerId } = await mutateAsync({ nickname, id: roomId });
      setPlayerId(playerId);
      navigate(`/room/${id}`);
    } catch (error) {
      handleRequestError(error, "Unable to join room");
    }
  };

  return { joinRoom, ...rest };
}
