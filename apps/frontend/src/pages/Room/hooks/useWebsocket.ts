import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  CardCode,
  GetRoomResponseDto,
  MoveBroadcast,
  SocketEvents,
} from "shared-types";
import io, { Socket } from "socket.io-client";

import { usePlayerId, useRoom } from "../../../context";

export function useWebsocket() {
  const [room, setRoom] = useRoom();
  const [playerId] = usePlayerId();
  const queryClient = useQueryClient();
  const updateRoom = useCallback(
    () => queryClient.invalidateQueries("room"),
    [queryClient]
  );

  const hasLostConnection = useRef(false);

  const socket = useRef<Socket>();

  useEffect(() => {
    if (!room?.id || !room?.player?.nickname || !playerId) {
      socket.current?.disconnect();
    } else {
      socket.current = io(window.location.origin, {
        query: {
          roomId: room?.id,
          playerId,
          nickname: room?.player.nickname,
        },
        path: "/api/socket.io",
      });
    }

    for (const event of [
      SocketEvents.GAME_STARTED,
      SocketEvents.JOINED_ROOM,
      SocketEvents.LEFT_ROOM,
    ]) {
      socket.current?.on(event, () => {
        updateRoom();
      });
    }

    socket.current?.on(SocketEvents.PLAYER_DISCONNECTED, (msg) => {
      toast.error(msg);
    });

    socket.current?.on(SocketEvents.MOVE_BROADCAST, (move: MoveBroadcast) => {
      addCardToTable(move.playedCard, setRoom);
      updateRoom();
    });

    socket.current?.on(SocketEvents.DISCONNECT, () => {
      toast.error("Lost connection to server");
      hasLostConnection.current = true;
    });

    socket.current?.on(SocketEvents.CONNECT, () => {
      if (hasLostConnection.current) {
        toast.success("Reconnected to server");
        hasLostConnection.current = false;
      }
    });

    socket.current?.on(SocketEvents.ReceiveReaction, (reaction: string) => {
      toast.info(reaction);
    });

    return () => {
      for (const prop in Object.values(SocketEvents)) {
        socket.current?.off(prop);
      }
      socket.current?.disconnect();
    };
  }, [
    room?.id,
    playerId,
    room?.player.nickname,
    socket,
    updateRoom,
    setRoom,
    hasLostConnection,
  ]);

  const sendReaction = useCallback(
    (reaction: string) => {
      socket?.current?.emit(SocketEvents.ReceiveReaction, reaction);
    },
    [socket]
  );

  return { sendReaction };
}

function addCardToTable(
  card: CardCode,
  setter: React.Dispatch<React.SetStateAction<GetRoomResponseDto | undefined>>
) {
  setter((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      table: [card, ...prev.table],
    };
  });
}
