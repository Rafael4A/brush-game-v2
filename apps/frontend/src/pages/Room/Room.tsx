import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { GameState } from "shared-code";

import { FullscreenLoader, MainContainer } from "../../components";
import { useWebsocket } from "./hooks";
import { GamePlay, RoundOver, WaitingForPlayers } from "./sections";
import { useRoom } from "../../context";
import { useDelayedGameState } from "./hooks/useDelayedGameState";

export function RoomScreen() {
  const { id } = useParams();

  const [room] = useRoom(id);

  const delayedGameState = useDelayedGameState(room);

  const { sendReaction } = useWebsocket();

  const section = () => {
    if (!room) return <FullscreenLoader />;

    switch (delayedGameState) {
      case GameState.WaitingForPlayers:
        return <WaitingForPlayers />;
      case GameState.Playing:
        return <GamePlay sendReaction={sendReaction} />;
      case GameState.RoundOver:
      case GameState.GameOver:
        return <RoundOver />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Playing - Brush Game</title>
        <meta name="description" content="Brush card game" />
      </Helmet>

      <MainContainer>{section()}</MainContainer>
    </>
  );
}
