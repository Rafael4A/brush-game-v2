import { CardCode, Player } from "../../types";
import { drawCards } from "./drawCards";

interface PlayersAndRemainingCards {
  players: Player[];
  remainingCards: CardCode[];
}

export function drawCardsForEachPlayer(
  playersWhoWillDraw: Player[],
  cardsAvailable: CardCode[]
) {
  return playersWhoWillDraw.reduce<PlayersAndRemainingCards>(
    ({ players, remainingCards }, player) => {
      const { drawn, remainingCards: remainingCardsAfterPlayerIsDealt } =
        drawCards(remainingCards, 3);

      return {
        players: [...players, { ...player, cards: drawn }],
        remainingCards: remainingCardsAfterPlayerIsDealt,
      };
    },
    { players: [], remainingCards: cardsAvailable }
  );
}
