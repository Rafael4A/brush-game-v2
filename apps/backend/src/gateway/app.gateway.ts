import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

import {
  Reaction,
  ServerReactionEvent,
  SocketEvents,
  SocketQuery,
} from "shared-code";

import { ValidationService } from "./sockets/validation.service";

@WebSocketGateway({ path: "/api/socket.io" })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private validationService: ValidationService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");
  private disconnectTimeouts = new Map<string, NodeJS.Timeout>();
  private reactionTimeouts = new Map<string, NodeJS.Timeout>();

  @SubscribeMessage(SocketEvents.SendReaction)
  handleReaction(client: Socket, reaction: Reaction): void {
    const { roomId, playerId, nickname } = client.handshake
      .query as unknown as SocketQuery;

    if (!this.reactionTimeouts.has(playerId)) {
      client.to(roomId).emit(SocketEvents.ReceiveReaction, {
        nickname,
        reaction,
      } satisfies ServerReactionEvent);

      this.reactionTimeouts.set(
        playerId,
        setTimeout(() => {
          this.reactionTimeouts.delete(playerId);
        }, 1000)
      );
    }

    this.logger.log("Received react from client");
  }

  afterInit(_server: Server) {
    this.logger.log("WebSocketGateway Initialized");
  }

  async handleConnection(client: Socket) {
    const { roomId, playerId, nickname } = client.handshake.query;

    if (
      typeof roomId !== "string" ||
      typeof playerId !== "string" ||
      typeof nickname !== "string"
    )
      return client.disconnect();

    const room = await this.validationService.getRoomForPlayer(
      roomId,
      playerId
    );

    if (!room) return client.disconnect();

    if (this.disconnectTimeouts.has(playerId)) {
      clearTimeout(this.disconnectTimeouts.get(playerId));
      this.disconnectTimeouts.delete(playerId);
    }

    const { nickname: dbNickname } = room.players.find(
      (p) => p.id === playerId
    );
    if (dbNickname !== nickname) return client.disconnect();

    client.join(roomId);

    client.on(SocketEvents.Disconnect, () => {
      this.disconnectTimeouts.set(
        playerId,
        setTimeout(() => {
          this.server
            .to(roomId)
            .emit(SocketEvents.PlayerDisconnected, `${nickname} disconnected`);
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
