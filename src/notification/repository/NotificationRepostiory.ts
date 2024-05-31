import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Notification, Prisma } from "@prisma/client";
import { BackendException } from "../../exception/BackendException";
import { MsgCode } from "../../exception/MsgCode";

interface NotificationContent {
    url: string;
    name: string
    price: string;
    imageUrl: string;
}

@Injectable()
export class NotificationRepository {

    constructor(private readonly prisma: PrismaService) {}
    
    public async findLastThreeUserNotifications(userId: string): Promise<Notification[]> {
        return await this.prisma.notification.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                receivedAt: 'desc',
            },
            take: 3,
        });
    }

    public async save({userId, productId, content}: {userId: string, productId: string, content: any}) {
        try {
            return await this.prisma.notification.create({
                data: {
                    userId: userId,
                    productId: productId,
                    content: content
                }
            })
        } catch (error) {
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION)
        }
    }

    public async existsNotificationByContent(content: string): Promise<boolean> {
        
        try {

            const parsedContent: NotificationContent = JSON.parse(content)

            const notifications: Notification[] = await this.prisma.$queryRaw(Prisma.sql`
                SELECT * FROM "Notification" 
                WHERE "content"->>'name' = ${parsedContent.name} 
                AND "content"->>'price' = ${parsedContent.price} 
                AND "content"->>'imageUrl' = ${parsedContent.imageUrl}
            `)

            return notifications.length > 0;
            
        } catch (error) {
            console.log(error)
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION)
        }
    }
}