import { useState, useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { GameState } from "shared-code";

import { FullscreenLoader, MainContainer } from "../../components";
import { delay } from "../../utils";
import { useGetRoom, useWebsocket } from "./hooks";
import { GamePlay, RoundOver, WaitingForPlayers } from "./sections";
import { useRoom } from "../../context";

interface RoomScreenProps {
  isLocalGame?: boolean;
}

export function RoomScreen({ isLocalGame }: Readonly<RoomScreenProps>) {
  const { id } = useParams();

  useGetRoom(id, isLocalGame);
  const [room] = useRoom();

  const [delayedGameState, setDelayedGameState] = useState<GameState>();

  const { sendReaction } = useWebsocket();

  useEffect(() => {
    if (!delayedGameState) setDelayedGameState(room?.gameState);
    else if (room?.gameState !== delayedGameState)
      (async () => {
        if (
          room?.gameState === GameState.RoundOver ||
          room?.gameState === GameState.GameOver
        ) {
          await delay(3000);
        }
        setDelayedGameState(room?.gameState);
      })();
  }, [room?.gameState, delayedGameState]);

  const section = () => {
    if (!room) return <FullscreenLoader />;

    switch (delayedGameState) {
      case GameState.WaitingForPlayers:
        return <WaitingForPlayers />;
      case GameState.Playing:
        return <GamePlay sendReaction={sendReaction} />;
      case GameState.RoundOver:
      case GameState.GameOver:
        return <RoundOver isLocalGame={isLocalGame} />;
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
