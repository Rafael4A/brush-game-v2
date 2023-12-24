import { createRef, useRef } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTheme } from "styled-components";

import { Button } from "../../../../components";
import { useRoom } from "../../../../context";
import {
  Card,
  MainGameContainer,
  PlayerCardsContainer,
  TableCardsContainer,
} from "./components";
import { BrushBanner } from "./components/BrushBanner";
import { GameHeader } from "./components/GameHeader";
import { useGamePlay } from "./hooks";

export function GamePlay() {
  const { colors } = useTheme();
  const [roomData] = useRoom();
  const data = roomData!;

  const {
    getRotation,
    handlePlayCards,
    handleSelectOwnCard,
    handleSelectTableCard,
    isOnTurn,
    selectedCard,
    selectedTableCards,
  } = useGamePlay(data);
  const brushBannerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <GameHeader data={data} />
      <MainGameContainer>
        <TableCardsContainer>
          <TransitionGroup component={null}>
            {data?.table?.map((card) => {
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

            {data?.table?.length <= 0 && (
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
          {data.player.cards?.map((card, index) => (
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
