import { CardCode } from "shared-code";

import { evaluateCardCode } from "./evaluateCardCode";

// export function calculateNumberCardsSum(cards: CardCode[]) {
//   if (cards.length === 0) return 0;

//   return calculateNumberStringCardsSum(cards);
// }

interface HighestCardsGroup {
  highestDiamond: null | CardCode;
  highestSpades: null | CardCode;
  highestClubs: null | CardCode;
  highestHearts: null | CardCode;
}

function doesCardCount(card: CardCode) {
  return !["J", "Q", "K"].includes(card.charAt(0));
}

// function calculateNumberStringCardsSum(cards: CardCode[]): number {
//   const highestCards = cards.reduce<HighestCardsGroup>(
//     (acc, card) => {
//       const cardValue = evaluateCardCode(card);
//       const cardSuit = card.charAt(1);

//       if (doesCardCount(card)) {
//         switch (cardSuit) {
//           case "D":
//             if (acc.highestDiamond < cardValue)
//               return { ...acc, highestDiamond: cardValue };
//             break;
//           case "S":
//             if (acc.highestSpades < cardValue)
//               return { ...acc, highestSpades: cardValue };
//             break;
//           case "C":
//             if (acc.highestClubs < cardValue)
//               return { ...acc, highestClubs: cardValue };
//             break;
//           case "H":
//             if (acc.highestHearts < cardValue)
//               return { ...acc, highestHearts: cardValue };
//             break;
//         }
//       }

//       return acc;
//     },
//     {
//       highestDiamond: 0,
//       highestSpades: 0,
//       highestClubs: 0,
//       highestHearts: 0,
//     }
//   );

//   return Object.values(highestCards).reduce((acc, value) => acc + value, 0);
// }

export function calculateCardsSum(cards: CardCode[]): number {
  const summableCards = getSummableCards(cards);
  const summableCardsValues = summableCards.map(evaluateCardCode);
  return summableCardsValues.reduce((acc, value) => acc + value, 0);
}

export function getSummableCards(cards: CardCode[]) {
  const highestCards = cards.reduce<HighestCardsGroup>(
    (acc, card) => {
      if (doesCardCount(card)) {
        const cardValue = evaluateCardCode(card);
        const cardSuit = card.charAt(1);

        switch (cardSuit) {
          case "D":
            if (
              !acc.highestDiamond ||
              evaluateCardCode(acc.highestDiamond) < cardValue
            )
              return { ...acc, highestDiamond: card };
            break;
          case "S":
            if (
              !acc.highestSpades ||
              evaluateCardCode(acc.highestSpades) < cardValue
            )
              return { ...acc, highestSpades: card };
            break;
          case "C":
            if (
              !acc.highestClubs ||
              evaluateCardCode(acc.highestClubs) < cardValue
            )
              return { ...acc, highestClubs: card };
            break;
          case "H":
            if (
              !acc.highestHearts ||
              evaluateCardCode(acc.highestHearts) < cardValue
            )
              return { ...acc, highestHearts: card };
            break;
        }
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
