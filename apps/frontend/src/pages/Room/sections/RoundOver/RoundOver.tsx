import { Link } from "react-router-dom";
import { GameState, PlayerReport } from "shared-code";
import { useTheme } from "styled-components";

import {
  Button,
  Column,
  LineLoader,
  LoadingButton,
  Row,
} from "../../../../components";
import { useRoom } from "../../../../context";
import { useGetReport, useNextRound } from "./hooks";
import {
  ButtonsContainer,
  Divider,
  FullReportContainer,
  LoaderContainer,
} from "./styles";
import { CardMiniature } from "./components";
import { ROUTES } from "../../../../resources/constants";

export function RoundOver() {
  const [roomData] = useRoom();
  const { data } = useGetReport();
  const { colors } = useTheme();
  const { nextRound, isLoading } = useNextRound();

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
          <Column key={r.nickname}>
            <span>{r.nickname}:</span>
            <Column alignItems="flex-start" width="min(17rem, 90vw)">
              <span>Total cards: {r.totalCards}</span>
              <span>Total diamonds: {r.totalDiamonds}</span>
              <span>Total brushes: {r.brushes}</span>
              {!!r.sumCards && (
                <span>
                  Sum cards:
                  <Row gap="4px">
                    {r.sumCards.map((card) => (
                      <CardMiniature key={card} cardCode={card} />
                    ))}
                  </Row>
                </span>
              )}
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
            <Link to={ROUTES.HOME} style={{ textDecoration: "none" }}>
              Leave Room
            </Link>
          </Button>
        )}
        {roomData.gameState !== GameState.GameOver &&
          !!roomData.player.isOwner && (
            <LoadingButton
              isLoading={isLoading}
              color={colors.palette_blue}
              onClick={nextRound}
            >
              Next Round
            </LoadingButton>
          )}
      </ButtonsContainer>
      {roomData.gameState !== GameState.GameOver &&
        !roomData.player.isOwner && (
          <LoaderContainer>
            <span>Waiting for next round</span>
            <LineLoader style={{ marginTop: "16px" }} />
          </LoaderContainer>
        )}
    </FullReportContainer>
  );
}
