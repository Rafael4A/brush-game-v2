import { GameState, Player, Room } from "../types";
import { drawCards } from "./utils";
import { randomInt } from "./utils/randomInt";

export function startGame(room: Room, playerId: string) {
  const player = room.players.find((p) => p.id === playerId);
  startGameValidations(room, player);

  const startingPlayer =
    room.players[randomInt(0, room.players.length)].nickname;

  const {
    drawn: roomTableCards,
    remainingCards: remainingCardsAfterTableIsDealt,
  } = drawCards(room.cards, 4);

  // Each player draws 3 cards
  const { players: updatedPlayers, remainingCards } = room.players.reduce(
    ({ players, remainingCards }, player) => {
      const { drawn, remainingCards: remainingCardsAfterPlayerIsDealt } =
        drawCards(remainingCards, 3);

      return {
        players: [...players, { ...player, cards: drawn }],
        remainingCards: remainingCardsAfterPlayerIsDealt,
      };
    },
    { players: [], remainingCards: remainingCardsAfterTableIsDealt }
  );

  const updatedRoom = {
    ...room,
    gameState: GameState.Playing,
    currentTurn: startingPlayer,
    firstPlayerIndex: startingPlayer,
    table: roomTableCards,
    cards: remainingCards,
    players: updatedPlayers,
  };

  return updatedRoom;
}

function startGameValidations(room: Room, player: Player) {
  if (player.isOwner === false) {
    throw new Error("Only the room owner can start the game");
  }

  if (room.gameState !== GameState.WaitingForPlayers)
    throw new Error("The game has already started");

  if (room.players.length <= 1)
    throw new Error("The game needs at least 2 players");
}
