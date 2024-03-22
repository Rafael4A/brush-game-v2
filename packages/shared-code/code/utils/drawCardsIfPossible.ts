import { Player, Room } from "../../types";
import { drawCards } from "./drawCards";

export function drawCardsIfPossible(room: Room, player: Player) {
  if (player.cards.length === 0 && room.cards.length >= 3) {
    const { drawn, remainingCards: updatedRoomCards } = drawCards(
      room.cards,
      3
    );

    const updatedPlayerCards = [...player.cards, ...drawn];

    const updatedPlayers = room.players.map((p) =>
      p.id === player.id ? { ...p, cards: updatedPlayerCards } : p
    );

    return {
      ...room,
      cards: updatedRoomCards,
      players: updatedPlayers,
    };
  }

  return room;
}
