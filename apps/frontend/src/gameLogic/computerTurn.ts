import { CardCode, Room, evaluateCardCode, playCard } from "shared-code";
import { LOCAL_COMPUTER_ID } from "../resources/constants";

interface Move {
  card: CardCode;
  tableCards: CardCode[];
}

function makeComputerMove(
  room: Room,
  { card, tableCards }: Move
): [CardCode, Room] {
  try {
    return [card, playCard(room, LOCAL_COMPUTER_ID, card, tableCards)];
  } catch (computerTurnError) {
    if (computerTurnError instanceof Error) {
      throw new Error(
        "ERROR CALCULATING COMPUTER TURN!:" + computerTurnError.message
      );
    } else {
      throw new Error("ERROR CALCULATING COMPUTER TURN!: Unable to play card");
    }
  }
}

/**
 * If there are no cards in the table, play the worst card for the next player: 4, 3, 2, A, K, 5, J, 6, Q, 7
 * If there are cards in the table, analyze all combinations of cards that sum to 15.
 * If there are no combinations that sum to 15, play the worst card for the next player. That would be any card that makes the sum of the cards in the table greater than 15. Follow worst cards order for preference.
 * If there are combinations that sum to 15, evaluate their worth considering the following rules:
 *     STRONGLY Prefer combinations that use the 7 of diamonds
 *     Prefer combinations that use diamonds
 *     Prefer combinations that use more cards
 *     Prefer combinations that use number cards
 */

export function playComputerCard(room: Room) {
  const computerPlayer = room.players.find(
    (player) => player.id === LOCAL_COMPUTER_ID
  );

  if (!computerPlayer) throw new Error("Computer player not found");

  const computerCards = computerPlayer.cards;
  const tableCards = room.table;

  if (tableCards.length === 0) {
    return makeComputerMove(room, {
      card: getWorstCard(computerCards),
      tableCards: [],
    });
  }

  const summableToFifteen: Move[] = [];

  const tableCombinations = getCombinations(tableCards);

  for (const tableCombination of tableCombinations) {
    const sum = tableCombination.reduce(
      (acc, curr) => acc + evaluateCardCode(curr),
      0
    );

    for (const computerCard of computerCards) {
      const sumWithComputerCard = sum + evaluateCardCode(computerCard);
      if (sumWithComputerCard === 15) {
        summableToFifteen.push({
          card: computerCard,
          tableCards: tableCombination,
        });
      }
    }
  }

  if (summableToFifteen.length > 0) {
    let bestMove: Move = summableToFifteen[0];
    let bestMoveScore = -Infinity;

    for (const combination of summableToFifteen) {
      const score = evaluateCombination([
        ...combination.tableCards,
        combination.card,
      ]);

      if (score > bestMoveScore || !bestMove) {
        bestMove = combination;
        bestMoveScore = score;
      }
    }

    return makeComputerMove(room, bestMove);
  }

  const tableCardsSum = tableCards.reduce(
    (acc, curr) => acc + evaluateCardCode(curr),
    0
  );

  if (tableCardsSum < 4) {
    let bestMove: CardCode | undefined = undefined;
    let bestMoveDistance = Infinity;
    for (const computerCard of computerCards) {
      const distance = 4 - (evaluateCardCode(computerCard) + tableCardsSum);

      if (distance < 0) continue;

      if (distance < bestMoveDistance) {
        bestMove = computerCard;
        bestMoveDistance = distance;
      }
    }

    if (bestMoveDistance <= 3 && !!bestMove) {
      return makeComputerMove(room, {
        card: bestMove,
        tableCards: [],
      });
    }
  }

  // Unable to sum to 15 and unable to leave table sum lower than 4 -> Play highest card
  const highestCard = computerCards.reduce((acc, curr) => {
    if (evaluateCardCode(curr) > evaluateCardCode(acc)) {
      return curr;
    }
    return acc;
  });

  return makeComputerMove(room, {
    card: highestCard,
    tableCards: [],
  });
}

function getCombinations<T>(arr: T[]): T[][] {
  const result: T[][] = [];
  const generator = (prefix: T[], arr: T[]) => {
    for (let i = 0; i < arr.length; i++) {
      result.push([...prefix, arr[i]]);
      generator([...prefix, arr[i]], arr.slice(i + 1));
    }
  };
  generator([], arr);
  return result;
}

function getWorstCard(cards: CardCode[]) {
  const worstToBestCardValues = [
    "4",
    "3",
    "2",
    "A",
    "K",
    "5",
    "J",
    "6",
    "Q",
    "7",
  ];

  return cards.reduce((acc, curr) => {
    if (
      worstToBestCardValues.indexOf(curr.charAt(0)) <
      worstToBestCardValues.indexOf(acc.charAt(0))
    ) {
      return curr;
    }
    return acc;
  }, cards[0]);
}

function evaluateCombination(cards: CardCode[]) {
  const valuableCardValues = ["4", "5", "6", "7"];

  let score = cards.length;

  for (const card of cards) {
    if (card === "7D") score += 100;

    if (card.charAt(1) === "D") score += 1;

    const position = valuableCardValues.indexOf(card.charAt(0));

    if (position > 0) score += position * position;
  }

  return score;
}
