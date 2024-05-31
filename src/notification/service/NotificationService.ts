import { Injectable } from "@nestjs/common";
import { Notification } from "@prisma/client";
import { NotificationRepository } from "../repository/NotificationRepostiory";
import { MyWebSocketGateway } from "../../websocket/MyWebSocketGateway";

@Injectable()
export class NotificationService {

    constructor(
        private readonly websocket: MyWebSocketGateway,
        private readonly notificationRepository: NotificationRepository
    ) {}

    public async getLastThreeUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationRepository.findLastThreeUserNotifications(userId)
    }

    public async addNotification({userId, productId, content}: {userId: string, productId: string, content: any}) {
        const notification = await this.notificationRepository.save({userId, productId, content})
        this.websocket.sendMessage(userId, notification)
    }

    public async existsNotificationByContent(content: string): Promise<boolean> {
        return await this.notificationRepository.existsNotificationByContent(content)
    }
}