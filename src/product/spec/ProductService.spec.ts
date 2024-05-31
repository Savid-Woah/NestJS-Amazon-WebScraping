import { Test, TestingModule } from '@nestjs/testing';
import { Product, User } from '@prisma/client';
import { ProductService } from '../service/ProductService';
import { ProductRequest } from '../request/ProductRequest';
import { ProductRepository } from '../repository/ProductRepository';
import { Decimal } from '@prisma/client/runtime/library';
import { BackendException } from '../../exception/BackendException';
import { MsgCode } from '../../exception/MsgCode';
import { Role } from '../../user/enum/Role';
import { UserRepository } from '../../user/repository/UserRepository';

describe('ProductService', () => {

    let productService: ProductService
    let userRepository: UserRepository
    let productRepository: ProductRepository

    beforeEach(async () => {
        
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: ProductRepository,
                    useValue: {
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        findById: jest.fn(),
                        findAllByUser: jest.fn()
                    },
                },
                {
                    provide: UserRepository,
                    useValue: {
                        findById: jest.fn()
                    },
                },
            ],
        }).compile()

        productService = module.get<ProductService>(ProductService)
        userRepository = module.get<UserRepository>(UserRepository)
        productRepository = module.get<ProductRepository>(ProductRepository)
    })

    it('should be defined', () => {
        expect(productService).toBeDefined()
        expect(userRepository).toBeDefined()
        expect(productRepository).toBeDefined()
    })

    describe('getAllProductsByWishlist', () => {

        it('should return all products associated to the given wishlist', async () => {
            
            // Given
            const userId = '03e33fd6-311d-4cf9-b23d-56f4f6e39b5b'

            const user: User = {
                id: userId,
                username: 'savid@gmail.com',
                password: '$#$$g#jk',
                roles: [Role.USER]
            }

            const expectedProductsByWishlist: Product[] = [
                {
                    id: '66b107c0-a742-4d78-977a-63cdd6f8bfbd',
                    name: 'Playstation 5',
                    price: new Decimal(100),
                    userId: userId
                },
                {
                    id: '08a0c6e5-cb7a-42a6-a35a-8c463e516266',
                    name: 'Jujutsu Kaisen',
                    price: new Decimal(800),
                    userId: userId
                },
            ]

            jest.spyOn(userRepository, 'findById').mockResolvedValue(user)
            jest.spyOn(productRepository, 'findAllByUser').mockResolvedValue(expectedProductsByWishlist)

            // When
            const result = await productService.getAllProductsByUser(userId)
            
            //Then
            expect(userRepository.findById).toHaveBeenCalledTimes(1)
            expect(productRepository.findAllByUser).toHaveBeenCalledTimes(1)

            expect(result).not.toBeNull()
            expect(result).toEqual(expectedProductsByWishlist)
            expect(result.every((product) => product.userId === userId))
        })

        it('should throw exception when wishlist is not found', async () => {

            // Given
            const userId = ''
            const user: User = null

            jest.spyOn(userRepository, 'findById').mockResolvedValue(user)

            // When - Then
            await expect(productService.getAllProductsByUser(userId))
            .rejects.toThrow(new BackendException(MsgCode.USER_NOT_FOUND))
        })
    })

    describe('addProductToWishlist', () => {
        
        it('should create a product', async () => {

            // Given
            const user: User = {
                id: 'a5ec078b-0527-4ce5-8544-7eafb062ec1c',
                username: 'savid@gmail.com',
                password: 'password123',
                roles: [Role.USER],
            }

            const productRequest: ProductRequest = {
                name: 'Xbox Series X',
                price: 100.0,
                userId: user.id
            }
        
            const savedProduct: Product = {
                id: '2e13788b-887e-4ffe-b35d-70ec01b54dc7',
                name: productRequest.name,
                price: new Decimal(productRequest.price),
                userId: user.id
            }
            
            jest.spyOn(userRepository, 'findById').mockResolvedValue(user)
            jest.spyOn(productRepository, 'save').mockResolvedValue(savedProduct)

            // When
            const result = await productService.addProductToWishlist(productRequest)

            // Then
            expect(userRepository.findById).toHaveBeenCalledTimes(1)
            expect(productRepository.save).toHaveBeenCalledTimes(1)

            expect(result).not.toBeNull()
            expect(result).toEqual(savedProduct);
            expect(result.userId === user.id)
        })
    })

    describe('updateProduct', () => {
        
        it('should update a product', async () => {

            // Given
            const user: User = {
                id: 'a5ec078b-0527-4ce5-8544-7eafb062ec1c',
                username: 'savid@gmail.com',
                password: 'password123',
                roles: [Role.USER],
            }

            const productId = '0fef44de-5bb3-41b4-b4a6-127c440728eb'

            const productRequest: ProductRequest = {
                name: 'Xbox Series X',
                price: 100.0,
                userId: user.id
            }
        
            const savedProduct: Product = {
                id: '2e13788b-887e-4ffe-b35d-70ec01b54dc7',
                name: 'JJk',
                price: new Decimal(500),
                userId: user.id
            }

            const updatedProduct: Product = {
                id: '2e13788b-887e-4ffe-b35d-70ec01b54dc7',
                name: productRequest.name,
                price: new Decimal(productRequest.price),
                userId: user.id
            }
            
            jest.spyOn(productRepository, 'findById').mockResolvedValue(savedProduct)
            jest.spyOn(productRepository, 'update').mockResolvedValue(updatedProduct)

            // When
            const result = await productService.updateProduct(productId, productRequest)

            // Then
            expect(productRepository.findById).toHaveBeenCalledTimes(1)
            expect(productRepository.update).toHaveBeenCalledTimes(1)

            expect(result).not.toBeNull()
            expect(result).toEqual(updatedProduct)
            expect(result.name !== savedProduct.name)
            expect(result.price !== savedProduct.price)
            expect(result.userId === user.id)
        })
    })
})