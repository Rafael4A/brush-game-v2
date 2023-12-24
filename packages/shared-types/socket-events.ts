import { CardCode } from "./card";

export enum SocketEvents {
  CONNECTION = "connection",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  MOVE_BROADCAST = "move-broadcast",
  GAME_STARTED = "game-started",
  JOINED_ROOM = "joined-room",
  LEFT_ROOM = "left-room",
  PLAYER_DISCONNECTED = "player-disconnected",
}

export interface MoveBroadcast {
  playedCard: CardCode;
}
