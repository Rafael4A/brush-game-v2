import { useState, useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { GameState } from "shared-types";

import { MainContainer } from "../../components";
import { usePlayerId } from "../../context";
import { delay } from "../../utils";
import { useGetRoom } from "./hooks";
import { GamePlay, WaitingForPlayers } from "./sections";

export function RoomScreen() {
  const { id } = useParams();
  const [playerId] = usePlayerId();

  const { data } = useGetRoom(id ?? "", playerId);

  const [delayedGameState, setDelayedGameState] = useState<GameState>();

  useEffect(() => {
    if (data?.gameState !== delayedGameState)
      (async () => {
        if (
          data?.gameState === GameState.RoundOver ||
          data?.gameState === GameState.GameOver
        ) {
          await delay(3000);
        }
        setDelayedGameState(data?.gameState);
      })();
  }, [data?.gameState, delayedGameState]);

  const section = () => {
    if (!data) return null;

    switch (delayedGameState) {
      case GameState.WaitingForPlayers:
        return <WaitingForPlayers />;
      case GameState.Playing:
        return <GamePlay />;
      case GameState.RoundOver:
        return <></>;
      case GameState.GameOver:
        return <></>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Home - Brush Game</title>
        <meta name="description" content="Brush card game" />
      </Helmet>
      <MainContainer>{section()}</MainContainer>
    </>
  );
}
