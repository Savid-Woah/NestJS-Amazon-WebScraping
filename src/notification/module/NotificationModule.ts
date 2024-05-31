import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { NotificationService } from "../service/NotificationService";
import { NotificationController } from "../controller/NotificationController";
import { NotificationRepository } from "../repository/NotificationRepostiory";
import { MyWebSocketGateway } from "../../websocket/MyWebSocketGateway";

@Module({
    controllers: [NotificationController],
    providers: [
        MyWebSocketGateway,
        NotificationService, 
        NotificationRepository
    ],
    imports: [PrismaModule]
})
export class NotificationModule {}