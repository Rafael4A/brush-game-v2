import { Card, Player } from "shared-types";

import { CARDS } from "../../resources";
import { DBPlayer, DBRoom } from "../entities";
import { Room } from "../room.interface";

// DB to Interface

// TODO, do it in a more performant way
export const cardCodeToCard = (cardCode: string): Card =>
  CARDS.find((card) => card.code === cardCode);

export const cardCodesToCards = (cardCodes: string[]): Card[] =>
  cardCodes.map(cardCodeToCard);

export const dbPlayerToPlayer = (dbPlayer: DBPlayer): Player => ({
  ...dbPlayer,
  cards: cardCodesToCards(dbPlayer.cards),
  collectedCards: cardCodesToCards(dbPlayer.collectedCards),
});

export const dbPlayersToPlayers = (dbPlayers: DBPlayer[]): Player[] =>
  dbPlayers.map(dbPlayerToPlayer);

export const dbRoomToRoom = (dbRoom: DBRoom): Room => ({
  ...dbRoom,
  cards: cardCodesToCards(dbRoom.cards),
  table: cardCodesToCards(dbRoom.table),
  players: dbPlayersToPlayers(dbRoom.players),
});

// Interface to DB

export const cardToCardCode = (card: Card): string => card.code;

export const cardsToCardCodes = (cards: Card[]): string[] =>
  cards.map(cardToCardCode);

export const playerToDbPlayer = (player: Player): DBPlayer => ({
  ...player,
  cards: cardsToCardCodes(player.cards),
  collectedCards: cardsToCardCodes(player.collectedCards),
});

export const playersToDbPlayers = (players: Player[]): DBPlayer[] =>
  players.map(playerToDbPlayer);

export const roomToDbRoom = (room: Room): DBRoom => ({
  ...room,
  cards: cardsToCardCodes(room.cards),
  table: cardsToCardCodes(room.table),
  players: playersToDbPlayers(room.players),
});
