import { GameState } from "shared-types";
import styled from "styled-components";

import { Column, Row } from "../../../../components";
import { useRoom } from "../../../../context";
import { useGetReport } from "./hooks";

export function RoundOver() {
  const [roomData] = useRoom();
  const { data } = useGetReport();
  // TODO FIX THIS FILE, IT IS CURRENTLY JUST A COPY OF THE OLDER VERSION
  if (!roomData) return null;

  return (
    <FullReportContainer>
      <h1>
        {roomData.gameState === GameState.GameOver ? "Game Over" : "Round Over"}{" "}
      </h1>
      <h2>Final scores:</h2>

      <ScoresContainer>
        {data?.map((r) => (
          <ScoreContainer key={r.nickname}>
            <span>{r.nickname}:</span>
            <Column style={{ alignItems: "flex-start" }}>
              <span>Total cards</span>
              <span>Total diamonds: {report.diamondCount}</span>
              <span>Total brushes: {report.brushCount}</span>
              <span>Total beauties: {report.beautyCount}</span>
              {report.previousPoints ? (
                <span>Previous points: {report.previousPoints}</span>
              ) : null}
              <Divider />
              <span>Total points: {report.totalPoints}</span>
            </Column>
          </ScoreContainer>
        ))}
      </ScoresContainer>

      <ButtonsContainer>
        <Button color={COLORS.dark_red} onClick={handleEndGame}>
          End game
        </Button>
        {!gameCompletelyOver && isRoomMaster ? (
          <Button color={COLORS.palette_blue} onClick={mutate}>
            Next Round
          </Button>
        ) : null}
      </ButtonsContainer>
      {!gameCompletelyOver && !isRoomMaster ? (
        <LoaderContainer>
          <span>Waiting for next round</span>
          <LineLoader style={{ marginTop: "16px" }} />
        </LoaderContainer>
      ) : null}
    </FullReportContainer>
  );
}
const ButtonsContainer = styled(Row)`
  margin-top: 16px;
  gap: 16px;
`;

const Divider = styled.span`
  margin: 4px 0;
  height: 2px;
  width: 100%;
  background-color: #fff;
`;

const FullReportContainer = styled(Column)`
  gap: 16px;
  margin-bottom: 40px;
`;

const ScoresContainer = styled(Column)`
  gap: 16px;
  align-items: flex-end;
`;

const ScoreContainer = styled(Row)`
  gap: 16px;
`;

const LoaderContainer = styled(Column)`
  width: 350px;
  max-width: 90vw;
`;
