// TODO DELETE!
import mongoose from "mongoose";
import { Card, GameState, Player, PlayerReport } from "shared-types";

import { CARDS } from "../resources";
import { Room } from "./room.interface";

const CardSchema = new mongoose.Schema<Card>({
  code: String,
  image: String,
  suit: String,
  value: String,
});

// const ReportSchema = new mongoose.Schema<PlayerReport>({
//   brushCount: { type: Number, default: 0 },
//   cardCount: { type: Number, default: 0 },
//   cardSum: { type: Number, default: 0 },
//   diamondCount: { type: Number, default: 0 },
//   hasBeauty: { type: Boolean, default: false },
//   previousPoints: { type: Number, default: 0 },
// });

export const PlayerSchema = new mongoose.Schema<Player>({
  cards: { type: [CardSchema], required: true, default: [] },
  id: { type: String, required: true, default: "crypto.randomUUID" },
  nickname: { type: String, required: [true, "Player nickname is required"] },
  collectedCards: { type: [CardSchema], required: true, default: [] },
  currentBrushCount: { type: Number, required: true, default: 0 },
  previousPoints: { type: Number, required: true, default: 0 },
  isOwner: { type: Boolean, required: true, default: false },
});

export const RoomSchema = new mongoose.Schema<Room>({
  id: {
    type: String,
    required: [true, "Room id is required"],
    unique: true,
    maxLength: [6, "Room id must have 6 characters"],
    minLength: [6, "Room id must have 6 characters"],
    lowercase: true,
  },
  creationDate: { type: Date, required: true, default: new Date() },
  cards: { type: [CardSchema], required: true, default: CARDS },
  table: { type: [CardSchema], required: true, default: [] },
  players: { type: [PlayerSchema], required: true, default: [] },
  firstPlayerIndex: { type: String, required: false },
  currentTurn: { type: String, required: false },
  gameState: {
    type: String,
    required: true,
    default: GameState.WaitingForPlayers,
  },
});

export const ROOM_MODEL_NAME = "Room";
export const PLAYER_MODEL_NAME = "Player";
