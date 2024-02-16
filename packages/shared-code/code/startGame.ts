import { GameState, Player, Room } from "../types";
import { drawCards, drawCardsForEachPlayer } from "./utils";
import { randomInt } from "./utils/randomInt";

export function startGame(room: Room, playerId: string) {
  const player = room.players.find((p) => p.id === playerId)!;
  startGameValidations(room, player);

  const startingPlayer =
    room.players[randomInt(0, room.players.length)].nickname;

  const {
    drawn: roomTableCards,
    remainingCards: remainingCardsAfterTableIsDealt,
  } = drawCards(room.cards, 4);

  const { players: updatedPlayers, remainingCards } = drawCardsForEachPlayer(
    room.players,
    remainingCardsAfterTableIsDealt
  );

  const updatedRoom = {
    ...room,
    gameState: GameState.Playing,
    currentTurn: startingPlayer,
    firstPlayerNick: startingPlayer,
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
