import { mdiEmoticonOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GameState } from "shared-types";

import { HelpCircleOutlineIcon } from "../../../../../../assets/icons";
import {
  HoverTooltip,
  Row,
  UnstyledButton,
} from "../../../../../../components";
import { useRoom } from "../../../../../../context";
import { HeaderContainer, RoomTitleContainer } from "./styles";
interface GameHeaderProps {
  sendReaction: (reaction: string) => void;
}
export function GameHeader({ sendReaction }: Readonly<GameHeaderProps>) {
  const [room] = useRoom();

  function getCurrentState() {
    if (room?.gameState === GameState.GameOver) return "Game has ended";
    if (room?.gameState === GameState.RoundOver) return "Round has ended";
    if (room?.player?.nickname === room?.currentTurn) return "It's your turn!";
    return `Waiting for ${room?.currentTurn}`;
  }

  return (
    <HeaderContainer id="cont">
      <Row gap="8px" padding="0 16px" fullWidth>
        <RoomTitleContainer>
          <span>{getCurrentState()}</span>
          <span>Remaining cards: {room?.remainingCards}</span>
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
        <UnstyledButton
          onClick={() => {
            sendReaction("s");
          }}
        >
          <Icon path={mdiEmoticonOutline} size={1} />
        </UnstyledButton>
      </Row>
    </HeaderContainer>
  );
}
