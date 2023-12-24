import { useState, useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { GameState } from "shared-types";

import { FullscreenLoader, MainContainer } from "../../components";
import { delay } from "../../utils";
import { useGetRoom, useWebsocket } from "./hooks";
import { GamePlay, RoundOver, WaitingForPlayers } from "./sections";

export function RoomScreen() {
  const { id } = useParams();

  const { data } = useGetRoom(id ?? "");

  const [delayedGameState, setDelayedGameState] = useState<GameState>();

  useWebsocket();

  useEffect(() => {
    if (!delayedGameState) setDelayedGameState(data?.gameState);
    else if (data?.gameState !== delayedGameState)
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
    if (!data) return <FullscreenLoader />;

    switch (delayedGameState) {
      case GameState.WaitingForPlayers:
        return <WaitingForPlayers />;
      case GameState.Playing:
        return <GamePlay />;
      case GameState.RoundOver:
      case GameState.GameOver:
        return <RoundOver />;
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
