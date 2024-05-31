import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from '../repository/NotificationRepostiory';
import { MyWebSocketGateway } from '../../websocket/MyWebSocketGateway';
import { NotificationService } from '../service/NotificationService';
import { Notification } from '@prisma/client';

describe('NotificationService', () => {

    let notificationService: NotificationService
    let notificationRepository: NotificationRepository
    let websocket: MyWebSocketGateway

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: MyWebSocketGateway,
                    useValue: {
                        sendMessage: jest.fn(),
                    },
                },
                {
                    provide: NotificationRepository,
                    useValue: {
                        findLastThreeUserNotifications: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        notificationService = module.get<NotificationService>(NotificationService);
        websocket = module.get<MyWebSocketGateway>(MyWebSocketGateway);
        notificationRepository = module.get<NotificationRepository>(NotificationRepository)
    })

    it('should be defined', () => {
        expect(websocket).toBeDefined()
        expect(notificationService).toBeDefined()
        expect(notificationRepository).toBeDefined()
    })

    describe('getLastThreeUserNotifications', () => {
        
        it('should return the last three notifications for a user', async () => {
            
            // Given
            const userId = 'f644a72d-ed61-44d0-9a9e-4b285569d6be';
            const productId = '93b5df3e-2ac3-4dff-a533-f0ee43a2ff90'

            const expectedNotifications = [
                { 
                    id: '980aaae3-84a4-4304-83b2-bf45dd7509c8', 
                    content: {}, 
                    receivedAt: new Date(), 
                    productId: productId, 
                    userId: userId
                },
                {
                    id: '5872429d-642d-40cb-9636-a2005605305c', 
                    content: {}, 
                    receivedAt: new Date(), 
                    productId: productId, 
                    userId: userId
                }
            ]
            
            jest.spyOn(notificationRepository, 'findLastThreeUserNotifications').mockResolvedValue(expectedNotifications);

            // When
            const result = await notificationService.getLastThreeUserNotifications(userId);

            // Then
            expect(result).toEqual(expectedNotifications);
            expect(notificationRepository.findLastThreeUserNotifications).toHaveBeenCalledWith(userId);
        })
    })

    describe('addNotification', () => {

        it('should add a notification and send a message via websocket', async () => {
            
            // Given
            const userId = '3fde78cd-b9fe-4ff6-af3a-a65cc1d9e73c'
            const productId = 'dbfeb96f-85ba-4d3b-81b0-e4cc9da99bb3'
            const content = {}

            const notification: Notification = {
                id: 'a1a19c4e-3a01-47a9-baba-ea19426d9036',
                content: {},
                receivedAt: new Date(),
                productId,
                userId
            }

            // When
            await notificationService.addNotification(notification);

            // Then
            expect(notificationRepository.save).toHaveBeenCalledWith({userId, productId, content});
            expect(websocket.sendMessage).toHaveBeenCalledTimes(1);
        })
    })
})
