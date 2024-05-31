import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NotificationService } from "../../notification/service/NotificationService";
import { ProductWithDetails } from "../../product/interface/ProductWithDetails";
import { ProductRepository } from "../../product/repository/ProductRepository";
import Decimal from "decimal.js";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from "puppeteer";
import { AmazonProductData } from "../../product/interface/AmazonProductData";

@Injectable()
export class ScrapingService {

    private readonly userAgents: string[] = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.47',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.43 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36OPR/94.0.0.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
    ]

    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor(
        private readonly productRepository: ProductRepository,
        private readonly notificationService: NotificationService,
    ) {
        puppeteer.use(StealthPlugin());
        puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
    }

    // 60 seconds for demo
    @Cron('*/60 * * * * *')
    public async scrapeAmazonWishlists() {

        const products: ProductWithDetails[] = await this.productRepository.findAllWithDetails()

        if (products.length === 0) return

        try {
            
            if (!this.browser) {

                this.browser = await puppeteer.launch({
                    headless: true,
                    ignoreHTTPSErrors: true,
                    devtools: true,
                    timeout: 3000
                })

                this.page = await this.browser.newPage()
                const userAgent = this.getRandomUserAgent()
                await this.page.setUserAgent(userAgent)
            }

            for (const product of products) {
                await this.scrapProductPrices(product)
            }

        } finally {
            this.closePage()
            this.closeBrowser()
        }
    }

    private async scrapProductPrices(productWithDetails: ProductWithDetails) {

        const userId = productWithDetails.userId;
        const productName = productWithDetails.name.trim().toLowerCase()

        await this.page.goto(`https://www.amazon.com/s?k=${productName}`, { timeout: 10000000 })

        await this.page.waitForSelector('.s-result-item', { timeout: 10000000 })

        const products = await this.page.evaluate(() => {

            const productList: NodeListOf<Element> = document.querySelectorAll('.s-result-item')

            const productData: AmazonProductData[] = []

            productList.forEach(product => { 
                
                const nameElement = product.querySelector('h2');
                const name = nameElement ? nameElement.innerText.trim() : 'Name not available'

                const priceElement = product.querySelector('.a-price .a-offscreen');
                const price = priceElement ? priceElement.textContent.trim() : 'Price not available'
                const linkElement = product.querySelector('h2 a');

                const url = linkElement ? linkElement.getAttribute('href') : 'URL not available'
                const imageElement = product.querySelector('img');

                const imageUrl = imageElement ? imageElement.getAttribute('src') : 'Image not available'

                productData.push({ name, price, url, imageUrl })
            })

            return productData
        })

        const processedProductIds = new Set<string>()

        for (const product of products) {

            const priceStr = product.price.split('$')[1]
            const price = parseFloat(priceStr)

            if (!isNaN(price)) {

                if (new Decimal(price).lte(productWithDetails.price)) {

                    const productId = productWithDetails.productId
                    
                    if (processedProductIds.has(productId)) return
                                        
                    await this.handleNotifications(product, productId, userId)

                    processedProductIds.add(productId)
                }
            }
        }
    }

    private async handleNotifications(product: any, productId: string, userId: string) {
        const existsNotification = await this.notificationService.existsNotificationByContent(JSON.stringify(product))
        if (existsNotification) return
        await this.notificationService.addNotification({userId: userId,productId: productId,content: product})
    }

    private getRandomUserAgent(): string {
        const randomIndex = Math.floor(Math.random() * this.userAgents.length)
        return this.userAgents[randomIndex]
    }

    private async closePage() {
        if (this.page) {
            await this.page.close()
            this.page = null;
        }
    }

    private async closeBrowser() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}
