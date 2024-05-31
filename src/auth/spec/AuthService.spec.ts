import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service/AuthService';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/UserService';
import { EncryptionService } from '../../encrypt/service/EncryptionService';
import { BackendException } from '../../exception/BackendException';
import { User } from '@prisma/client';
import { Role } from '../../user/enum/Role';

describe('AuthService', () => {

    let jwtService: JwtService
    let authService: AuthService
    let userService: UserService
    let encryptionService: EncryptionService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserByUsername: jest.fn(),
                        register: jest.fn(),
                    },
                },
                {
                    provide: EncryptionService,
                    useValue: {
                        comparePasswords: jest.fn(),
                        encrypt: jest.fn()
                    },
                },
            ],
        }).compile()

        authService = module.get<AuthService>(AuthService)
        jwtService = module.get<JwtService>(JwtService)
        userService = module.get<UserService>(UserService)
        encryptionService = module.get<EncryptionService>(EncryptionService)
    })

    it('should be defined', () => {
        expect(authService).toBeDefined()
        expect(jwtService).toBeDefined()
        expect(userService).toBeDefined()
        expect(encryptionService).toBeDefined()
    });

    describe('validateUser', () => {
        
        it('should return a signed JWT if credentials are valid', async () => {
            
            // Given
            const loginRequest = {
                username: 'testuser',
                password: 'testpassword',
            };

            const user: User = {
                id: '3dc025ed-a136-48c3-a80e-c9e1f15e712c',
                username: 'testuser',
                password: 'hashedpassword',
                roles: [Role.USER],
            };

            jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user)
            jest.spyOn(encryptionService, 'comparePasswords').mockResolvedValue(true)
            jest.spyOn(jwtService, 'sign').mockReturnValue('signedToken')
            jest.spyOn(encryptionService, 'encrypt').mockReturnValue('encryptedToken')

            // When
            const result = await authService.validateUser(loginRequest)

            // Then
            expect(userService.getUserByUsername).toHaveBeenCalledWith(loginRequest.username)
            expect(encryptionService.comparePasswords).toHaveBeenCalledWith(loginRequest.password, user.password)
            expect(result).not.toBeNull()
            expect(result).toEqual('encryptedToken')
        })

        it('should throw BackendException if credentials are invalid', async () => {
            
            // Given
            const loginRequest = { username: 'testuser', password: 'testpassword' }

            const user: User = {
                id: 'db29708a-a614-4704-b200-e2367ab3b5f3',
                username: 'testuser',
                password: 'hashedpassword',
                roles: [Role.USER],
            }

            jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user)
            jest.spyOn(encryptionService, 'comparePasswords').mockResolvedValue(false)

            // When - Then
            await expect(authService.validateUser(loginRequest)).rejects.toThrow(BackendException)
        })
    })

    describe('validateOAuthUser', () => {

        it('should return a signed JWT if the user exists', async () => {

            // Given
            const oauthRequest = { username: 'oauthuser', name: 'OAuth User' };

            const user: User = { 
                id: 'd13acd8b-85c0-4d59-8387-c9a3c7253dbd', 
                username: 'valentina@gmail.com', 
                password: null, 
                roles: [Role.USER]
            };

            jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user)
            jest.spyOn(jwtService, 'sign').mockReturnValue('signedToken')
            jest.spyOn(encryptionService, 'encrypt').mockReturnValue('encryptedToken')

            // When
            const result = await authService.validateOAuthUser(oauthRequest);

            // Then
            expect(userService.getUserByUsername).toHaveBeenCalledWith(oauthRequest.username)
            
            expect(jwtService.sign).toHaveBeenCalledWith({
                id: user.id,
                username: user.username,
                roles: user.roles
            })

            expect(result).toEqual('encryptedToken')
        })

        it('should save a new user and return a signed JWT if the user does not exist', async () => {
            
            // Given
            const oauthRequest = { username: 'newoauthuser', name: 'New OAuth User' }
            
            const savedUser: User = { 
                id: '69f401dc-e210-4fb6-91fa-a51828a769e1', 
                username: 'savid@gmail.com', 
                password: null, 
                roles: [Role.USER]
            }

            jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null)
            jest.spyOn(userService, 'register').mockResolvedValue(savedUser)
            jest.spyOn(jwtService, 'sign').mockReturnValue('signedToken')
            jest.spyOn(encryptionService, 'encrypt').mockReturnValue('encryptedToken')

            // When
            const result = await authService.validateOAuthUser(oauthRequest)

            // Then
            expect(userService.getUserByUsername).toHaveBeenCalledWith(oauthRequest.username)
            expect(userService.register).toHaveBeenCalledWith({
                username: oauthRequest.username,
                password: '',
                role: Role.USER
            })

            expect(jwtService.sign).toHaveBeenCalledWith({
                id: savedUser.id,
                username: savedUser.username,
                roles: savedUser.roles
            })

            expect(result).toEqual('encryptedToken')
        })
    })
})