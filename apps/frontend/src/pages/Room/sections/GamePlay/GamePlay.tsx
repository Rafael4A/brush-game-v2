import { CSSTransition, TransitionGroup } from "react-transition-group";
import { GetRoomResponseDto } from "shared-types";
import { useTheme } from "styled-components";

import { Button } from "../../../../components";
import {
  Card,
  MainContainer,
  PlayerCardsContainer,
  TableCardsContainer,
} from "./components";
import { GameHeader } from "./components/GameHeader";
import { useGamePlay } from "./hooks";

interface GamePlayProps {
  data: GetRoomResponseDto;
}

export function GamePlay({ data }: Readonly<GamePlayProps>) {
  const { colors } = useTheme();

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
              <CSSTransition key={card.code} timeout={1500} classNames="card">
                <Card
                  card={card}
                  onSelect={handleSelectTableCard}
                  isSelected={selectedTableCards.includes(card)}
                />
              </CSSTransition>
            ))}
            {data?.table?.length <= 0 ? <>Brush! The table is empty!</> : null}
          </TransitionGroup>
        </TableCardsContainer>

        <Button
          color={colors.blue}
          style={{ fontSize: "1.5rem" }}
          disabled={!selectedCard?.code || !isOnTurn()}
          onClick={handlePlayCards}
        >
          {selectedTableCards.length ? "Play Cards" : "Play Card"}
        </Button>

        <PlayerCardsContainer>
          {data.player.cards?.map((card, index) => (
            <Card
              key={card.code}
              card={card}
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
