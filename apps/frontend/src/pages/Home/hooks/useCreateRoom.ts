import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { BasicRoomResponseDto, NewRoomDtoType } from "shared-code";

import { usePlayerId } from "../../../context";
import { axiosInstance, handleRequestError } from "../../../resources/api";

export function useCreateRoom() {
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();

  async function post({
    nickname,
  }: NewRoomDtoType): Promise<BasicRoomResponseDto> {
    const response = await axiosInstance.post("/room", { nickname });

    return response.data;
  }

  const { mutateAsync, ...rest } = useMutation("createRoom", post);

  const createRoom = async (nickname: string) => {
    try {
      const { id, playerId } = await mutateAsync({ nickname });
      setPlayerId(playerId);
      navigate(`/room/${id}`);
    } catch (error) {
      handleRequestError(error, "Unable to create room");
    }
  };

  return { createRoom, ...rest };
}
