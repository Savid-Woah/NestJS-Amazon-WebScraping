import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/UserService';
import { HttpStatus } from '@nestjs/common';
import { Message } from '../../response/message/Message';
import { plainToClass } from 'class-transformer';
import { UserDTO } from '../dto/UserDTO';
import { Role } from '../enum/Role';
import { UserController } from '../controller/UserController';

describe('UserController', () => {

    let controller: UserController
    let userService: UserService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        register: jest.fn(),
                    },
                },
            ],
        }).compile()

        controller = module.get<UserController>(UserController)
        userService = module.get<UserService>(UserService)
    })

    describe('register', () => {
        
        it('should respond with data: user dto, status: CREATED, message: USER_REGISTERED', async () => {
            
            const userData = {
                username: 'savid@gmail.com',
                password: 'savid',
                role: Role.USER,
            }

            const userRegistered = {
                id: '9bf0c012-1902-4616-a479-1084e6750356',
                username: 'testuser',
                password: 'testpassword',
                roles: [Role.USER],
            }

            jest.spyOn(userService, 'register').mockResolvedValueOnce(userRegistered)

            const response = await controller.register(userData)

            expect(userService.register).toHaveBeenCalledWith(userData)

            expect(response).toEqual({
                data: plainToClass(UserDTO, userRegistered),
                status: HttpStatus.CREATED,
                message: Message.USER_REGISTERED,
            })
        })
    })
})
