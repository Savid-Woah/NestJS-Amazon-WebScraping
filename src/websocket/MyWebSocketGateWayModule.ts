import { Module } from "@nestjs/common";
import { MyWebSocketGateway } from "./MyWebSocketGateway";

@Module({
    providers: [MyWebSocketGateway],
    exports: [MyWebSocketGateway],
})
export class MyWebsocketGatewayModule {}