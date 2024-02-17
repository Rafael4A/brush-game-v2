import { useEffect } from "react";

import { Helmet } from "react-helmet-async";

import { CARDS_CODES, GameState } from "shared-code";

import { FullscreenLoader, MainContainer } from "../../components";
import { useRoom } from "../../context";
import { useWebsocket } from "./hooks";
import { useDelayedGameState } from "./hooks/useDelayedGameState";
import { GamePlay, RoundOver, WaitingForPlayers } from "./sections";

export function RoomScreen() {
  const [room] = useRoom();

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

  useEffect(() => {
    const cardImagesUrls = [
      "/resources/cards/default_webp/card-back.webp",
      ...CARDS_CODES.map(
        (code) => `/resources/cards/default_webp/${code}.webp`
      ),
    ];

    cardImagesUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Playing - Brush Game</title>
      </Helmet>

      <MainContainer>{section()}</MainContainer>
    </>
  );
}
