import { evaluateCardCode } from "./evaluateCardCode";

export function calculateNumberCardsSum(cards: string[]) {
  if (cards.length === 0) return 0;

  return calculateNumberStringCardsSum(cards);
}

interface HighestCardsGroup {
  highestDiamond: number;
  highestSpades: number;
  highestClubs: number;
  highestHearts: number;
}

function doesCardCount(card: string) {
  return !["J", "Q", "K"].includes(card.charAt(0));
}

function calculateNumberStringCardsSum(cards: string[]): number {
  const highestCards = cards.reduce<HighestCardsGroup>(
    (acc, card) => {
      const cardValue = evaluateCardCode(card);
      const cardSuit = card.charAt(1);

      if (doesCardCount(card)) {
        switch (cardSuit) {
          case "D":
            if (acc.highestDiamond < cardValue)
              return { ...acc, highestDiamond: cardValue };
            break;
          case "S":
            if (acc.highestSpades < cardValue)
              return { ...acc, highestSpades: cardValue };
            break;
          case "C":
            if (acc.highestClubs < cardValue)
              return { ...acc, highestClubs: cardValue };
            break;
          case "H":
            if (acc.highestHearts < cardValue)
              return { ...acc, highestHearts: cardValue };
            break;
        }
      }

      return acc;
    },
    {
      highestDiamond: 0,
      highestSpades: 0,
      highestClubs: 0,
      highestHearts: 0,
    }
  );

  return Object.values(highestCards).reduce((acc, value) => acc + value, 0);
}
