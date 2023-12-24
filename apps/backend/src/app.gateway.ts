import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";

import { SocketEvents } from "shared-types";
import { Socket, Server } from "socket.io";

import { ValidationService } from "./sockets/validation.service";

@WebSocketGateway({ path: "/api/socket.io" })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private validationService: ValidationService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");
  private disconnectTimeouts = new Map<string, NodeJS.Timeout>();

  @SubscribeMessage("reaction")
  handlePong(_client: Socket, text: string): void {
    console.log("onreaction", text);
    this.logger.log("Received pong from client");
  }

  afterInit(_server: Server) {
    this.logger.log("Initialized!");
  }

  async handleConnection(client: Socket) {
    const { roomId, playerId } = client.handshake.query;

    if (typeof roomId !== "string" || typeof playerId !== "string")
      throw new WsException("Invalid credentials.");

    const room = await this.validationService.getRoomForPlayer(
      roomId,
      playerId
    );

    if (!room) throw new WsException("Invalid credentials.");

    if (this.disconnectTimeouts.has(playerId)) {
      clearTimeout(this.disconnectTimeouts.get(playerId));
      this.disconnectTimeouts.delete(playerId);
    }

    const { nickname } = room.players.find((p) => p.id === playerId);

    client.join(roomId);

    client.on(SocketEvents.DISCONNECT, () => {
      this.disconnectTimeouts.set(
        playerId,
        setTimeout(() => {
          this.server
            .to(roomId)
            .emit(SocketEvents.PLAYER_DISCONNECTED, `${nickname} disconnected`);
          this.disconnectTimeouts.delete(playerId);
        }, 3000)
      );
    });

    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
