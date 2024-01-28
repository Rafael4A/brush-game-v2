import { createRef, useRef } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTheme } from "styled-components";

import { LoadingButton } from "../../../../components";
import { useRoom } from "../../../../context";
import { Card, GameHeader } from "./components";
import { useGamePlay } from "./hooks";
import {
  BrushBanner,
  MainGameContainer,
  PlayerCardsContainer,
  TableCardsContainer,
} from "./styles";
import { Reaction } from "shared-code";

interface GamePlayProps {
  sendReaction: (reaction: Reaction) => void;
}

export function GamePlay({ sendReaction }: Readonly<GamePlayProps>) {
  const { colors } = useTheme();
  const [roomData] = useRoom();
  const room = roomData!;
  const {
    getRotation,
    handlePlayCards,
    handleSelectOwnCard,
    handleSelectTableCard,
    isOnTurn,
    selectedCard,
    selectedTableCards,
    isLoading,
  } = useGamePlay();
  const brushBannerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <GameHeader sendReaction={sendReaction} />
      <MainGameContainer>
        <TableCardsContainer>
          <TransitionGroup component={null}>
            {room.table.map((card) => {
              const ref = createRef<HTMLButtonElement>();
              return (
                <CSSTransition
                  key={card}
                  timeout={1500}
                  classNames="card"
                  nodeRef={ref}
                >
                  <Card
                    ref={ref}
                    cardCode={card}
                    onSelect={handleSelectTableCard}
                    isSelected={selectedTableCards.includes(card)}
                  />
                </CSSTransition>
              );
            })}

            {room.table.length <= 0 && (
              <CSSTransition
                timeout={0}
                classNames="brush-banner"
                unmountOnExit
                nodeRef={brushBannerRef}
              >
                <BrushBanner ref={brushBannerRef}>
                  Brush! The table is empty!
                </BrushBanner>
              </CSSTransition>
            )}
          </TransitionGroup>
        </TableCardsContainer>

        <LoadingButton
          isLoading={isLoading}
          color={colors.blue}
          largeFont
          disabled={!selectedCard || !isOnTurn()}
          onClick={handlePlayCards}
          style={{ minWidth: "9rem" }}
        >
          {selectedTableCards.length ? "Play Cards" : "Play Card"}
        </LoadingButton>

        <PlayerCardsContainer>
          {room.player.cards.map((card, index) => (
            <Card
              key={card}
              cardCode={card}
              onSelect={handleSelectOwnCard}
              isSelected={card === selectedCard}
              isPersonalCard
              rotation={getRotation(index)}
            />
          ))}
        </PlayerCardsContainer>
      </MainGameContainer>
    </>
  );
}
