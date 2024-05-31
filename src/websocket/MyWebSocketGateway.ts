import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Server } from 'socket.io'

@WebSocketGateway()
export class MyWebSocketGateway {

    @WebSocketServer()
    server: Server

    public sendMessage(userId: string, message: any): void {
        this.server.emit(`wishlist-notification-for-user/${userId}`, message)
    }
}