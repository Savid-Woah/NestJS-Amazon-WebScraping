import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from '../service/ScrapingService';
import { ProductRepository } from '../../product/repository/ProductRepository';
import { NotificationService } from '../../notification/service/NotificationService';
import Decimal from 'decimal.js';
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';

jest.mock('puppeteer-extra')

describe('ScrapingService', () => {

    let scrapingService: ScrapingService
    let productRepository: ProductRepository
    let notificationService: NotificationService

    let mockPage: jest.Mocked<Page>
    let mockBrowser: jest.Mocked<Browser>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScrapingService,
                {
                    provide: NotificationService,
                    useValue: {
                        existsNotificationByContent: jest.fn(),
                        addNotification: jest.fn(),
                    },
                },
                {
                    provide: ProductRepository,
                    useValue: {
                        findAllWithDetails: jest.fn(),
                    },
                },
            ],
        }).compile()

        scrapingService = module.get<ScrapingService>(ScrapingService)
        productRepository = module.get<ProductRepository>(ProductRepository)
        notificationService = module.get<NotificationService>(NotificationService)

        mockPage = {
            setUserAgent: jest.fn().mockResolvedValue(null),
            goto: jest.fn().mockResolvedValue(null),
            close: jest.fn().mockResolvedValue(null),
            waitForSelector: jest.fn().mockResolvedValue(null),
            evaluate: jest.fn().mockResolvedValue([
                {
                    name: 'Jjk',
                    price: '$10.00',
                    url: 'http://example.com/product1',
                    imageUrl: 'http://example.com/product1.jpg',
                },
            ]),
        } as unknown as jest.Mocked<Page>

        mockBrowser = {
            newPage: jest.fn().mockResolvedValue(mockPage),
            close: jest.fn().mockResolvedValue(null),
        } as unknown as jest.Mocked<Browser>

        (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('scrapeAmazonWishlists', () => {

        it('should scrape product prices from Amazon and add notifications', async () => {
            
            const productsWithDetails = [
                {
                    productId: '64420c04-7f6e-4f04-8a4f-dbb26503929d',
                    userId: '2d1fd90d-a8b3-45b1-ac61-5f88cc4b73c6',
                    price: new Decimal(100),
                    name: 'Playstation 5',
                },
            ]

            jest.spyOn(productRepository, 'findAllWithDetails').mockResolvedValue(productsWithDetails)
            jest.spyOn(notificationService, 'existsNotificationByContent').mockResolvedValue(false)

            await scrapingService.scrapeAmazonWishlists()

            expect(mockPage.goto).toHaveBeenCalledTimes(1)
            expect(mockPage.waitForSelector).toHaveBeenCalledTimes(1)
            expect(mockPage.evaluate).toHaveBeenCalledTimes(1)
            expect(notificationService.existsNotificationByContent).toHaveBeenCalledTimes(1)
            expect(notificationService.addNotification).toHaveBeenCalledTimes(1)
        })
    })
})
