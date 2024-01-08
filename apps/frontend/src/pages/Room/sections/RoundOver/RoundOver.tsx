import { Link } from "react-router-dom";
import { GameState, PlayerReport } from "shared-types";
import { useTheme } from "styled-components";

import { Button, Column, LineLoader, Row } from "../../../../components";
import { useRoom } from "../../../../context";
import { useGetReport, useNextRound } from "./hooks";
import {
  ButtonsContainer,
  Divider,
  FullReportContainer,
  LoaderContainer,
} from "./styles";
import { CardMiniature } from "./components";

export function RoundOver() {
  const [roomData] = useRoom();
  const { data } = useGetReport();
  const { colors } = useTheme();
  const { nextRound } = useNextRound();

  if (!roomData) return null;

  const playerHasPoints = (report: PlayerReport) =>
    report.hasBeauty ||
    report.hasMoreCards ||
    report.hasMoreDiamonds ||
    report.hasHighestSum ||
    report.brushes > 0 ||
    report.previousPoints > 0;

  return (
    <FullReportContainer>
      <h1>
        {roomData.gameState === GameState.GameOver ? "Game Over" : "Round Over"}
      </h1>
      <h2>Final scores:</h2>

      <Column gap="16px" alignItems="flex-end">
        {data?.map((r) => (
          <Column key={r.nickname} width="min(550px, 90vw)">
            <span>{r.nickname}:</span>
            <Column style={{ alignItems: "flex-start" }}>
              <span>Total cards: {r.totalCards}</span>
              <span>Total diamonds: {r.totalDiamonds}</span>
              <span>Total brushes: {r.brushes}</span>
              <span>
                Sum cards:{" "}
                <Row gap="4px">
                  {r.sumCards.map((card) => (
                    <CardMiniature key={card} cardCode={card} />
                  ))}
                </Row>
              </span>
              {playerHasPoints(r) && (
                <>
                  <span>Points:</span>
                  {r.hasBeauty && <span>Beauty: +1</span>}
                  {r.hasMoreCards && <span>Most cards: +1</span>}
                  {r.hasMoreDiamonds && <span>Most diamonds: +1</span>}
                  {r.hasHighestSum && <span>Highest sum: +1</span>}
                  {!!r.brushes && <span>Brushes: +{r.brushes}</span>}
                  {!!r.previousPoints && (
                    <span>Previous points: +{r.previousPoints}</span>
                  )}
                </>
              )}
              <Divider />
              <span>Total points: {r.currentPoints}</span>
            </Column>
          </Column>
        ))}
      </Column>

      <ButtonsContainer>
        {roomData.gameState === GameState.GameOver && (
          <Button color={colors.dark_red}>
            <Link to="/" style={{ textDecoration: "none" }}>
              End game
            </Link>
          </Button>
        )}
        {roomData.gameState !== GameState.GameOver &&
        roomData.player.isOwner ? (
          <Button color={colors.palette_blue} onClick={nextRound}>
            Next Round
          </Button>
        ) : null}
      </ButtonsContainer>
      {roomData.gameState !== GameState.GameOver && !roomData.player.isOwner ? (
        <LoaderContainer>
          <span>Waiting for next round</span>
          <LineLoader style={{ marginTop: "16px" }} />
        </LoaderContainer>
      ) : null}
    </FullReportContainer>
  );
}
