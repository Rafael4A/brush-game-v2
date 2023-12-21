import { GameState, GetRoomResponseDto } from "shared-types";
import styled from "styled-components";

import { HelpCircleOutlineIcon } from "../../../../../assets/icons/help-circle-outline";
import { Column, HoverTooltip, Row } from "../../../../../components";

interface GameHeaderProps {
  data: GetRoomResponseDto;
}

export function GameHeader({ data }: Readonly<GameHeaderProps>) {
  function getCurrentState() {
    if (data.gameState === GameState.GameOver) return "Game has ended";
    if (data.gameState === GameState.RoundOver) return "Round has ended";
    if (data?.player?.nickname === data.currentTurn) return "It's your turn!";
    return `Waiting for ${data.currentTurn}`;
  }

  return (
    <HeaderContainer>
      <Row gap="8px" padding="0 16px">
        <RoomTitleContainer>
          <span>{getCurrentState()}</span>
          <span>Remaining cards: {data?.remainingCards}</span>
        </RoomTitleContainer>
        <Row>
          <HoverTooltip>
            <HelpCircleOutlineIcon />
            <span>
              Card values:
              <br /> A = 1
              <br /> Q = 8
              <br /> J = 9
              <br /> K = 10
            </span>
          </HoverTooltip>
        </Row>
      </Row>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Row)({ marginTop: "16px" });

const RoomTitleContainer = styled(Column)({
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
});
