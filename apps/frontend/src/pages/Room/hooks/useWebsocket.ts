import { useCallback, useEffect } from "react";

import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import {
  CardCode,
  GetRoomResponseDto,
  MoveBroadcast,
  SocketEvents,
} from "shared-types";
import io from "socket.io-client";

import { usePlayerId, useRoom } from "../../../context";

export function useWebsocket() {
  const [room, setRoom] = useRoom();
  const [playerId] = usePlayerId();
  const queryClient = useQueryClient();
  const location = useLocation();
  const updateRoom = useCallback(
    () => queryClient.invalidateQueries("room"),
    [queryClient]
  );

  const socket = io(window.location.origin, {
    query: {
      roomId: room?.id,
      playerId,
    },
    path: "/api/socket.io",
    autoConnect: false,
  });

  useEffect(() => {
    (() => {
      if (!room?.id || !playerId) return;

      socket.connect();
    })();

    return () => {
      socket.disconnect();
    };
    // Disable as per instructed on the docs https://socket.io/pt-br/how-to/use-with-react#remarks-about-the-useeffect-hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, room?.id, location.pathname]);

  useEffect(() => {
    (async () => {
      for (const event of [
        SocketEvents.GAME_STARTED,
        SocketEvents.JOINED_ROOM,
        SocketEvents.LEFT_ROOM,
      ]) {
        socket.on(event, () => {
          updateRoom();
        });
      }

      socket.on(SocketEvents.PLAYER_DISCONNECTED, (msg) => {
        console.log(JSON.stringify(msg));
      });

      socket.on(SocketEvents.MOVE_BROADCAST, (move: MoveBroadcast) => {
        console.log("move", move);
        addCardToTable(move.playedCard, setRoom);
        updateRoom();
      });
    })();

    return () => {
      for (const prop in Object.values(SocketEvents)) {
        socket?.off(prop);
      }
    };
  }, [playerId, room?.id, location.pathname, socket, updateRoom, setRoom]);
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
