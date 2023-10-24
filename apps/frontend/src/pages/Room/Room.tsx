import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { GameState } from "shared-types";

import { MainContainer } from "../../components";
import { usePlayerId } from "../../context";
import { useRoom } from "./hooks";
import { WaitingForPlayers } from "./sections";

export function RoomScreen() {
  const { id } = useParams();
  const [playerId] = usePlayerId();

  const { data } = useRoom(id ?? "", playerId);

  const section = () => {
    // switch (data?.gameState) {
    // case GameState.WaitingForPlayers:
    //   return <WaitingForPlayers data={data} />;
    // case GameState.Playing:
    //   return <></>;
    // case GameState.RoundOver:
    //   return <></>;
    // case GameState.GameOver:
    //   return <></>;
    // }
    if (data?.gameState === GameState.WaitingForPlayers) {
      return <WaitingForPlayers data={data} />;
    }
    return <></>;
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
