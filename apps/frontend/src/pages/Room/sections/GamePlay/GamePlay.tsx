import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTheme } from "styled-components";

import { Button } from "../../../../components";
import { useRoom } from "../../../../context";
import {
  Card,
  MainContainer,
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

  return (
    <>
      <GameHeader data={data} />
      <MainContainer>
        <TableCardsContainer>
          <TransitionGroup component={null}>
            {data?.table?.map((card) => (
              <CSSTransition key={card} timeout={1500} classNames="card">
                <Card
                  cardCode={card}
                  onSelect={handleSelectTableCard}
                  isSelected={selectedTableCards.includes(card)}
                />
              </CSSTransition>
            ))}
            {data?.table?.length <= 0 && (
              <CSSTransition
                timeout={0}
                classNames="brush-banner"
                unmountOnExit
              >
                <BrushBanner>Brush! The table is empty!</BrushBanner>
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
      </MainContainer>
    </>
  );
}
