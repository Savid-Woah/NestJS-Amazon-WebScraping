import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../controller/NotificationController';
import { NotificationService } from '../service/NotificationService';
import { Message } from '../../response/message/Message';

describe('NotificationController', () => {

    let controller: NotificationController
    let notificationService: NotificationService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({

            controllers: [NotificationController],
            providers: [
                {
                    provide: NotificationService,
                    useValue: {
                        getLastThreeUserNotifications: jest.fn()
                    }
                }
                
            ]
        }).compile()

        controller = module.get<NotificationController>(NotificationController)
        notificationService = module.get<NotificationService>(NotificationService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getLastThreeUserNotifications', () => {
        
        // Given
        it('should return the last three notifications for a given user', async () => {
            
            const userId = 'ffd4e7c3-3b2d-4bbf-a147-3a45a78e7656'
            
            const notifications = [
                {
                    id: 'a1a19c4e-3a01-47a9-baba-ea19426d9036',
                    content: {},
                    receivedAt: new Date(),
                    productId: '8eb191fb-03ae-4655-a181-38f883fc8bf7',
                    userId
                }
            ]

            jest.spyOn(notificationService, 'getLastThreeUserNotifications').mockResolvedValueOnce(notifications)
            
            
            // When
            const result = await controller.getLastThreeUserNotifications(userId)

            // Then
            expect(notificationService.getLastThreeUserNotifications).toHaveBeenCalledTimes(1)
            expect(notificationService.getLastThreeUserNotifications).toHaveBeenCalledWith(userId)
    
            expect(result).not.toBeNull()
            expect(result).toEqual({
                data: notifications,
                status: 200,
                message: Message.DATA_FETCHED,
            })
        })
    })
})