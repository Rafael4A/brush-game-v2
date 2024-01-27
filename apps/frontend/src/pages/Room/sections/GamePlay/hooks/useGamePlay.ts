import { useState } from "react";

import { CardCode } from "shared-code";

import { useRoom } from "../../../../../context";
import { Rotation } from "../components/Card/types";
import { usePlayCards } from "./usePlayCards";

export function useGamePlay() {
  const [selectedCard, setSelectedCard] = useState<CardCode>();
  const [selectedTableCards, setSelectedTableCards] = useState<CardCode[]>([]);
  const { playCards } = usePlayCards();
  const [room] = useRoom();

  const handleSelectTableCard = (card: CardCode) => {
    if (!isOnTurn()) return;

    if (selectedTableCards.includes(card)) {
      setSelectedTableCards(selectedTableCards.filter((c) => c !== card));
    } else {
      setSelectedTableCards([...selectedTableCards, card]);
    }
  };

  const isOnTurn = () => room?.player.nickname === room?.currentTurn;

  const handlePlayCards = () => {
    const cardCode = selectedCard;

    if (!cardCode) return;

    playCards(cardCode, selectedTableCards);

    setSelectedCard(undefined);
    setSelectedTableCards([]);
  };

  const getRotation = (index: number) => {
    switch (room?.player.cards.length) {
      case 3:
        if (index === 1) return Rotation.Middle;
        return index === 0 ? Rotation.Left : Rotation.Right; //TODO COMENTAR LINHA E VER SE FUNCIONA
      case 2:
        return index === 0 ? Rotation.Left : Rotation.Right;
      default:
        return Rotation.Middle;
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
