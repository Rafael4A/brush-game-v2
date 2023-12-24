import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import { SocketEvents } from "shared-types";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ path: "/api/socket.io" })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  @SubscribeMessage("reaction")
  handlePong(_client: Socket, text: string): void {
    console.log("onreaction", text);
    this.logger.log("Received pong from client");
  }

  afterInit(_server: Server) {
    this.logger.log("Initialized!");
  }

  handleConnection(client: Socket) {
    const { roomId, playerId } = client.handshake.query;

    // TODO check if room exists and if playerId is valid and get Nickname

    const nickname = "placeholder_nickname";

    if (!roomId || !playerId) client.disconnect();

    client.join(roomId);

    client.on(SocketEvents.DISCONNECT, () => {
      this.server
        .to(roomId)
        .emit(SocketEvents.PLAYER_DISCONNECTED, `${nickname} disconnected`);
    });

    this.logger.log(`Client connected: ${client.id}`);
    client.emit("ping", "ping");
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
