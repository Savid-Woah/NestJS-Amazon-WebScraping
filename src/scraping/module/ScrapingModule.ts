import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ScrapingService } from "../service/ScrapingService";
import { ProductRepository } from "../../product/repository/ProductRepository";
import { NotificationRepository } from "../../notification/repository/NotificationRepostiory";
import { NotificationService } from "../../notification/service/NotificationService";
import { MyWebSocketGateway } from "../../websocket/MyWebSocketGateway";

@Module({
    controllers: [],
    providers: [
        ScrapingService, 
        ProductRepository, 
        MyWebSocketGateway,
        NotificationService,
        NotificationRepository
    ],
    imports: [PrismaModule]
})
export class ScrappingModule {}