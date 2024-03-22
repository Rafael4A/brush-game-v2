import { CardCode, CardCodeSuit } from "../../types";
import { evaluateCardCode } from "./evaluateCardCode";

interface HighestCardsGroup {
  highestDiamond: null | CardCode;
  highestSpades: null | CardCode;
  highestClubs: null | CardCode;
  highestHearts: null | CardCode;
}

function doesCardCount(card: CardCode) {
  return !["J", "Q", "K"].includes(card.charAt(0));
}

function updateIfHigherCard(highestCards: HighestCardsGroup, card: CardCode) {
  const cardValue = evaluateCardCode(card);
  const cardSuit = card.charAt(1) as CardCodeSuit;

  const suitAndProperty = new Map<CardCodeSuit, keyof HighestCardsGroup>([
    ["D", "highestDiamond"],
    ["S", "highestSpades"],
    ["C", "highestClubs"],
    ["H", "highestHearts"],
  ]);

  const propertyName = suitAndProperty.get(cardSuit)!;
  const highestCardOfTheSuit = highestCards[propertyName];

  if (
    !highestCardOfTheSuit ||
    evaluateCardCode(highestCardOfTheSuit) < cardValue
  ) {
    return { ...highestCards, [propertyName]: card };
  }

  return highestCards;
}

export function getSummableCards(cards: CardCode[]): CardCode[] {
  const highestCards = cards.reduce<HighestCardsGroup>(
    (acc, card) => {
      if (doesCardCount(card)) {
        return updateIfHigherCard(acc, card);
      }

      return acc;
    },
    {
      highestDiamond: null,
      highestSpades: null,
      highestClubs: null,
      highestHearts: null,
    }
  );

  return Object.values(highestCards).filter((card) => !!card);
}
