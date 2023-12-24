import { useState } from "react";

import { CardCode, GetRoomResponseDto } from "shared-types";

import { usePlayCards } from "./usePlayCards";

export function useGamePlay(data: GetRoomResponseDto) {
  const [selectedCard, setSelectedCard] = useState<CardCode>();
  const [selectedTableCards, setSelectedTableCards] = useState<CardCode[]>([]);
  const { playCards } = usePlayCards();

  const handleSelectTableCard = (card: CardCode) => {
    if (!isOnTurn()) return;

    if (selectedTableCards.includes(card)) {
      setSelectedTableCards(selectedTableCards.filter((c) => c !== card));
    } else {
      setSelectedTableCards([...selectedTableCards, card]);
    }
  };

  const isOnTurn = () => data.player.nickname === data.currentTurn;

  const handlePlayCards = () => {
    const cardCode = selectedCard;

    if (!cardCode) return;

    playCards(cardCode, selectedTableCards);

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

  const handleSelectOwnCard = (card: CardCode) => {
    setSelectedCard(selectedCard === card ? undefined : card);
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