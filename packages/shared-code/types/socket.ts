import { CardCode } from "./card";

export interface SocketQuery {
  roomId: string;
  playerId: string;
  nickname: string;
}

export enum SocketEvents {
  Connection = "connection",
  Connect = "connect",
  Disconnect = "disconnect",
  MoveBroadcast = "move-broadcast",
  GameStarted = "game-started",
  JoinedRoom = "joined-room",
  LeftRoom = "left-room",
  PlayerDisconnected = "player-disconnected",
  SendReaction = "send-reaction",
  ReceiveReaction = "receive-reaction",
}

export interface MoveBroadcast {
  playedCard: CardCode;
}
