import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  CardCode,
  GetRoomResponseDto,
  MoveBroadcast,
  Reaction,
  ServerReactionEvent,
  SocketEvents,
} from "shared-code";
import io, { Socket } from "socket.io-client";

import { usePlayerId, useRoom } from "../../../context";
import { isRoomLocal, reactionMapper } from "../../../utils";

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
    } else if (isRoomLocal(room)) {
      return;
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
      SocketEvents.GameStarted,
      SocketEvents.JoinedRoom,
      SocketEvents.LeftRoom,
    ]) {
      socket.current?.on(event, () => {
        updateRoom();
      });
    }

    socket.current?.on(SocketEvents.PlayerDisconnected, (msg) => {
      toast.error(msg);
    });

    socket.current?.on(SocketEvents.MoveBroadcast, (move: MoveBroadcast) => {
      addCardToTable(move.playedCard, setRoom);
      updateRoom();
    });

    socket.current?.on(SocketEvents.Disconnect, () => {
      toast.error("Lost connection to server");
      hasLostConnection.current = true;
    });

    socket.current?.on(SocketEvents.Connect, () => {
      if (hasLostConnection.current) {
        toast.success("Reconnected to server");
        hasLostConnection.current = false;
      }
    });

    socket.current?.on(
      SocketEvents.ReceiveReaction,
      ({ nickname, reaction }: ServerReactionEvent) => {
        toast.info(`${nickname}: ${reactionMapper(reaction)}`);
      }
    );

    return () => {
      for (const prop in Object.values(SocketEvents)) {
        socket.current?.off(prop);
      }
      socket.current?.disconnect();
      hasLostConnection.current = false;
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
    (reaction: Reaction) => {
      socket?.current?.emit(SocketEvents.SendReaction, reaction);
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
