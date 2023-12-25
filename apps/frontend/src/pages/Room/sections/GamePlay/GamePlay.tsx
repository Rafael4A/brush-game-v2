import { createRef, useRef } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTheme } from "styled-components";

import { Button } from "../../../../components";
import { useRoom } from "../../../../context";
import { Card, GameHeader } from "./components";
import { useGamePlay } from "./hooks";
import {
  BrushBanner,
  MainGameContainer,
  PlayerCardsContainer,
  TableCardsContainer,
} from "./styles";

interface GamePlayProps {
  sendReaction: (reaction: string) => void;
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

        <Button
          color={colors.blue}
          style={{ fontSize: "1.5rem" }}
          disabled={!selectedCard || !isOnTurn()}
          onClick={handlePlayCards}
        >
          {selectedTableCards.length ? "Play Cards" : "Play Card"}
        </Button>

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
