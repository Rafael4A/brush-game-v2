import { useState } from "react";

import { Card, GetRoomResponseDto } from "shared-types";

import { usePlayCards } from "./usePlayCards";

export function useGamePlay(data: GetRoomResponseDto) {
  const [selectedCard, setSelectedCard] = useState<Card>();
  const [selectedTableCards, setSelectedTableCards] = useState<Card[]>([]);
  const { playCards } = usePlayCards();

  const handleSelectTableCard = (card: Card) => {
    if (!isOnTurn()) return;

    if (selectedTableCards.some((c) => c.code === card.code)) {
      setSelectedTableCards(
        selectedTableCards.filter((c) => c.code !== card.code)
      );
    } else {
      setSelectedTableCards([...selectedTableCards, card]);
    }
  };

  const isOnTurn = () => data.player.nickname === data.currentTurn;

  const handlePlayCards = () => {
    const cardCode = selectedCard?.code;
    const tableCardsCodes = selectedTableCards.map((card) => card.code);

    if (!cardCode) return;

    playCards(cardCode, tableCardsCodes);

    setSelectedCard(undefined);
    setSelectedTableCards([]);
  };

  const getRotation = (index: number) => {
    switch (data.player.cards.length) {
      case 3:
        if (index === 1) return "middle";
        return index === 0 ? "left" : "right";
      case 2:
        return index === 0 ? "left" : "right";
      default:
        return "middle";
    }
  };

  const handleSelectOwnCard = (card: Card) => {
    setSelectedCard(selectedCard?.code === card.code ? undefined : card);
  };

  return {
    handleSelectTableCard,
    isOnTurn,
    handlePlayCards,
    getRotation,
    handleSelectOwnCard,
    selectedCard,
    selectedTableCards,
  };
}
