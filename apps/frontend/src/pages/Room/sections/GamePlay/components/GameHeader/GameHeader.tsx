import { useState } from "react";

import { mdiEmoticonOutline, mdiHelpCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { GameState, Reaction } from "shared-code";

import {
  HoverTooltip,
  Row,
  UnstyledButton,
} from "../../../../../../components";
import { GameTypes, useGameType, useRoom } from "../../../../../../context";
import { REACTIONS } from "../../../../../../resources/constants";
import {
  HeaderContainer,
  ReactionButton,
  ReactionsContainer,
  ReactionsMenuWrapper,
  RoomTitleContainer,
} from "./styles";

interface GameHeaderProps {
  sendReaction: (reaction: Reaction) => void;
}

export function GameHeader({ sendReaction }: Readonly<GameHeaderProps>) {
  const [room] = useRoom();
  const [gameType] = useGameType();
  const [shouldShowReactionsMenu, setShouldShowReactionsMenu] = useState(false);
  const [areReactionsEnabled, setAreReactionsEnabled] = useState(true);

  function getCurrentState() {
    if (room?.gameState === GameState.GameOver) return "Game has ended";
    if (room?.gameState === GameState.RoundOver) return "Round has ended";
    if (room?.player?.nickname === room?.currentTurn) return "It's your turn!";
    return `Waiting for ${room?.currentTurn}`;
  }

  const handleReaction = (reaction: Reaction) => {
    sendReaction(reaction);
    setShouldShowReactionsMenu(false);
    setAreReactionsEnabled(false);
    setTimeout(() => {
      setAreReactionsEnabled(true);
    }, 1000);
  };

  return (
    <HeaderContainer id="cont">
      <Row gap="8px" padding="0 16px" fullWidth>
        <RoomTitleContainer>
          <span>{getCurrentState()}</span>
          <span>Remaining cards: {room?.remainingCards}</span>
        </RoomTitleContainer>
        <Row>
          <HoverTooltip>
            <Icon path={mdiHelpCircleOutline} size={1} />
            <span>
              Card values:
              <br /> A = 1
              <br /> Q = 8
              <br /> J = 9
              <br /> K = 10
            </span>
          </HoverTooltip>
        </Row>
        {gameType !== GameTypes.Local && (
          <ReactionsMenuWrapper>
            <UnstyledButton
              onClick={() => setShouldShowReactionsMenu((prev) => !prev)}
            >
              <Icon path={mdiEmoticonOutline} size={1} />
            </UnstyledButton>
            {shouldShowReactionsMenu && (
              <ReactionsContainer>
                {REACTIONS.map(({ icon, name }) => (
                  <ReactionButton
                    key={name}
                    onClick={() => handleReaction(name)}
                    disabled={!areReactionsEnabled}
                  >
                    {icon}
                  </ReactionButton>
                ))}
              </ReactionsContainer>
            )}
          </ReactionsMenuWrapper>
        )}
      </Row>
    </HeaderContainer>
  );
}
