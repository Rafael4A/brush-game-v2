import { useEffect, useState } from "react";

import { GameState, GetRoomResponseDto } from "shared-code";

export function useDelayedGameState(room: GetRoomResponseDto | undefined) {
  const [delayedGameState, setDelayedGameState] = useState<GameState>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!delayedGameState) setDelayedGameState(room?.gameState);
    else if (room?.gameState !== delayedGameState) {
      if (
        [GameState.RoundOver, GameState.GameOver].includes(
          room?.gameState as GameState
        )
      ) {
        timeout = setTimeout(() => {
          setDelayedGameState(room?.gameState);
        }, 3000);
      } else {
        setDelayedGameState(room?.gameState);
      }
    }

    return () => !!timeout && clearTimeout(timeout);
  }, [room?.gameState, delayedGameState]);
  return delayedGameState;
}
