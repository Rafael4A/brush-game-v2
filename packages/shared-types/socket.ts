import { CardCode } from "./card";

export interface SocketQuery {
  roomId: string;
  playerId: string;
  nickname: string;
}

export enum SocketEvents {
  CONNECTION = "connection",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  MOVE_BROADCAST = "move-broadcast",
  GAME_STARTED = "game-started",
  JOINED_ROOM = "joined-room",
  LEFT_ROOM = "left-room",
  PLAYER_DISCONNECTED = "player-disconnected",
  SendReaction = "send-reaction",
  ReceiveReaction = "receive-reaction",
}

export interface MoveBroadcast {
  playedCard: CardCode;
}
