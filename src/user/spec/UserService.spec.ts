import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/UserService';
import { UserRepository } from '../repository/UserRepository';
import { User } from '@prisma/client';
import { EncryptionService } from '../../encrypt/service/EncryptionService';
import { Role } from '../enum/Role';

describe('UserService', () => {

    let userService: UserService
    let userRepository: UserRepository
    let encryptionService: EncryptionService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: {
                        save: jest.fn(),
                        findByUsername: jest.fn(),
                    },
                },
                {
                    provide: EncryptionService,
                    useValue: {
                        hashPassword: jest.fn(),
                    },
                },
            ],
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<UserRepository>(UserRepository)
        encryptionService = module.get<EncryptionService>(EncryptionService)
    });

    it('should be defined', () => {
        expect(userService).toBeDefined()
        expect(userRepository).toBeDefined()
        expect(encryptionService).toBeDefined()
    })

    describe('register', () => {
        
        it('should register user and assign a wishlist to it', async () => {
            
            // Given
            const username = 'savid'
            const password = '#$%#$D'
            const role = Role.USER

            const hashedPassword = 'hashedPassword123';
            
            const expectedUser: User = {
                id: '7e887d40-7f7c-4c3d-b425-5c302f2df3cf',
                username: username,
                password: hashedPassword,
                roles: [Role.USER]
            };

            jest.spyOn(encryptionService, 'hashPassword').mockResolvedValue(hashedPassword)
            jest.spyOn(userRepository, 'save').mockResolvedValue(expectedUser)

            // When
            await userService.register({username, password, role})

            // Then
            expect(userRepository.save).toHaveBeenCalledTimes(1)
            expect(encryptionService.hashPassword).toHaveBeenCalledTimes(1)
            expect(encryptionService.hashPassword).toHaveBeenCalledWith(password)
        })
    })
})