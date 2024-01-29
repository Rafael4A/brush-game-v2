import { CARDS_CODES } from "../constants";
import { GameState, Player, Room } from "../types";
import { generateReport } from "./generateReport";
import { drawCards, nextTurnIndex, shuffleCards } from "./utils";

export function nextRound(room: Room, playerId: string): Room {
  const player = room.players.find((p) => p.id === playerId);

  nextRoundValidations(room, player);
  const newRoom = { ...room };

  const nextPlayerIndex = nextTurnIndex(
    newRoom.players.findIndex(
      (player) => player.nickname === newRoom.firstPlayerNick
    ),
    newRoom.players.length
  );
  newRoom.cards = shuffleCards(CARDS_CODES);
  newRoom.table = [];

  const report = generateReport(room);
  newRoom.players = newRoom.players.map((p) => {
    return {
      ...p,
      cards: [],
      collectedCards: [],
      currentBrushCount: 0,
      previousPoints: report.find((r) => r.nickname === p.nickname)
        .currentPoints,
    };
  });

  const {
    drawn: roomTableCards,
    remainingCards: remainingCardsAfterTableIsDealt,
  } = drawCards(newRoom.cards, 4);

  // Each player draws 3 cards
  const { players: updatedPlayers, remainingCards } = newRoom.players.reduce(
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

  return {
    ...newRoom,
    gameState: GameState.Playing,
    currentTurn: newRoom.players[nextPlayerIndex].nickname,
    firstPlayerNick: newRoom.players[nextPlayerIndex].nickname,
    table: roomTableCards,
    cards: remainingCards,
    players: updatedPlayers,
  };
}

function nextRoundValidations(room: Room, player: Player) {
  if (player.isOwner === false) {
    throw new Error("Only the room owner can start the game");
  }

  if (room.gameState !== GameState.RoundOver)
    throw new Error("Cannot start a new round now");
}
