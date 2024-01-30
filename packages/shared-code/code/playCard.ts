import { CardCode, GameState, Player, Room } from "../types";
import { handleTurnEnd } from "./handleTurnEnd";
import { willSumToFifteen } from "./utils";

export function playCard(
  room: Room,
  playerId: string,
  cardCode: CardCode,
  usedTableCardsCodes: CardCode[]
) {
  const player = room.players.find((p) => p.id === playerId);

  playCardValidations(room, player, cardCode, usedTableCardsCodes);

  const allCardsCodes = [cardCode, ...usedTableCardsCodes];

  if (usedTableCardsCodes.length === 0) {
    // Simply moves card from player to table
    const updatedTable = [cardCode, ...room.table];
    const updatedPlayerCards = player.cards.filter((c) => c !== cardCode);
    const updatedPlayers = room.players.map((p) =>
      p.id === playerId ? { ...p, cards: updatedPlayerCards } : p
    );

    const updatedRoom = {
      ...room,
      table: updatedTable,
      players: updatedPlayers,
    };

    return handleTurnEnd(updatedRoom, playerId);
  } else if (willSumToFifteen(allCardsCodes)) {
    // When the sum of the cards is 15, the player collects the cards
    const usedTableCards = room.table.filter((c) =>
      usedTableCardsCodes.includes(c)
    );

    const updatedPlayerCollectedCards = [
      ...player.collectedCards,
      ...usedTableCards,
      cardCode,
    ];

    const updatedTable = room.table.filter(
      (c) => !usedTableCardsCodes.includes(c)
    );
    const updatedPlayerCards = player.cards.filter((c) => c !== cardCode);

    const updatedPlayers = room.players.map((p) =>
      p.id === playerId
        ? {
            ...p,
            cards: updatedPlayerCards,
            collectedCards: updatedPlayerCollectedCards,
            currentBrushCount:
              p.currentBrushCount + (updatedTable.length === 0 ? 1 : 0),
          }
        : p
    );

    const updatedRoom = {
      ...room,
      table: updatedTable,
      players: updatedPlayers,
    };

    return handleTurnEnd(updatedRoom, playerId);
  } else {
    throw new Error("Cards sum is not 15");
  }
}

function playCardValidations(
  room: Room,
  player: Player,
  cardCode: CardCode,
  usedTableCardsCodes: CardCode[]
) {
  if (room.gameState !== GameState.Playing)
    throw new Error("The game is not in progress");

  if (
    room.players.find((p) => p.nickname === room.currentTurn).id !== player.id
  )
    throw new Error("It's not your turn");

  if (!player.cards.includes(cardCode))
    throw new Error("You don't have this card");

  const roomTableCardsCodes = room.table.map((c) => c);
  const tableCardsAreValid = usedTableCardsCodes.every((c) =>
    roomTableCardsCodes.includes(c)
  );

  if (!tableCardsAreValid) throw new Error("Invalid table cards");
}
