import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthController } from '../controller/AuthController';

describe('AuthController', () => {

    let controller: AuthController
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn()
                    },
                },
            ],
        }).compile()

        controller = module.get<AuthController>(AuthController)
        configService = module.get<ConfigService>(ConfigService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('login', () => {
        
        it('should login and return jwt', async () => {

            // Given
            const mockRequest: any = {
                username: 'savid@gmail.com', 
                password: 'testpassword'
            }

            // When
            const result = await controller.login(mockRequest)

            // Then
            expect(result).toEqual(mockRequest.user)
        })
    })

    describe('handleGoogleCallBack', () => {
        
        it('should redirect to the specified URL with the user token', async () => {
            
            // Given
            const mockRequest: any = {token: 'jwt'}

            const mockResponse: Partial<Response> = {redirect: jest.fn()}

            // When
            await controller.handleFacebookCallBack(mockRequest, mockResponse as Response);

            // Then
            expect(mockResponse.redirect).toHaveBeenCalledTimes(1)
        })
    })

    describe('handleFacebookCallBack', () => {
        
        it('should redirect to the specified URL with the user token', async () => {
            
            // Given
            const mockRequest: any = {token: 'jwt'}
            
            const mockResponse: Partial<Response> = {redirect: jest.fn()}

            // When
            await controller.handleFacebookCallBack(mockRequest, mockResponse as Response)

            // Then
            expect(mockResponse.redirect).toHaveBeenCalledTimes(1)
        })
    })
})
