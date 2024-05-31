import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../service/ProductService';
import { HttpStatus } from '@nestjs/common';
import { Message } from '../../response/message/Message';
import { ProductRequest } from '../request/ProductRequest';
import { ProductController } from '../controller/ProductController';
import { Product } from '@prisma/client';
import Decimal from 'decimal.js';

describe('ProductController', () => {

    let controller: ProductController
    let productService: ProductService

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        getAllProductsByUser: jest.fn(),
                        addProductToWishlist: jest.fn(),
                        updateProduct: jest.fn(),
                        deleteProduct: jest.fn(),
                    },
                },
            ],
        }).compile()

        controller = module.get<ProductController>(ProductController)
        productService = module.get<ProductService>(ProductService)
    })

    describe('getAllProductsByUser', () => {

        it('should respond with data: productS, status: OK, message: DATA_FOUND', async () => {
            
            const userId = '823c5ce1-b282-48ca-ac92-121abf971a75'
            
            const products = [
                {
                    id: '66b107c0-a742-4d78-977a-63cdd6f8bfbd',
                    name: 'Playstation 5',
                    price: new Decimal(100),
                    userId: userId
                },
                {
                    id: '08a0c6e5-cb7a-42a6-a35a-8c463e516266',
                    name: 'Product 2',
                    price: new Decimal(800),
                    userId: userId
                },
            ]

            jest.spyOn(productService, 'getAllProductsByUser').mockResolvedValueOnce(products);

            const response = await controller.getAllProductsByUser(userId);

            expect(productService.getAllProductsByUser).toHaveBeenCalledWith(userId);
            expect(response).toEqual({
                data: products,
                status: HttpStatus.FOUND,
                message: Message.DATA_FETCHED
            })
        })
    })

    describe('addProductToWishlist', () => {

        it('should respond with data: saved product, status: CREATED, message: PRODUCT_CREATED', async () => {
            
            const productRequest: ProductRequest = {
                name: 'Jjk',
                price: 10,
                userId: '28a8f511-4ffe-45b5-b7ed-7d839a2b029a'
            }

            const savedProduct: Product = {
                id: '',
                name: 'Jjk',
                price: new Decimal(10),
                userId: '28a8f511-4ffe-45b5-b7ed-7d839a2b029a'
            }

            jest.spyOn(productService, 'addProductToWishlist').mockResolvedValueOnce(savedProduct)

            const response = await controller.addProductToWishlist(productRequest)

            expect(productService.addProductToWishlist).toHaveBeenCalledWith(productRequest)

            expect(response).toEqual({
                data: savedProduct,
                status: HttpStatus.CREATED,
                message: Message.PRODUCT_CREATED
            })
        })

        it('should respond with data: updated product, status: OK, message: PRODUCT_UPDATED', async () => {
            
            const productId = '52890099-ef72-4b55-97ee-8651ce303883'

            const productRequest: ProductRequest = {
                name: 'Jjk',
                price: 100,
                userId: '28a8f511-4ffe-45b5-b7ed-7d839a2b029a'
            }

            const updatedProduct: Product = {
                id: productId,
                name: 'Jjk',
                price: new Decimal(100),
                userId: '28a8f511-4ffe-45b5-b7ed-7d839a2b029a'
            }

            jest.spyOn(productService, 'updateProduct').mockResolvedValueOnce(updatedProduct)

            const response = await controller.updateProduct(productId, productRequest);
            expect(productService.updateProduct).toHaveBeenCalledWith(productId, productRequest)

            expect(response).toEqual({
                data: updatedProduct,
                status: HttpStatus.OK,
                message: Message.PRODUCT_UPDATED
            })
        })
    })
})
