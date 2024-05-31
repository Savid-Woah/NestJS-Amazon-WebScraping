import { Role } from "../enum/Role";
import { UserRepository } from "../repository/UserRepository";
import { UserDTO } from "../dto/UserDTO";
import { plainToClass } from "class-transformer";
import { Injectable } from "@nestjs/common";
import { EncryptionService } from "../../encrypt/service/EncryptionService";
import { User } from "@prisma/client";
import { BackendException } from "../../exception/BackendException";
import { MsgCode } from "../../exception/MsgCode";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService
    ) {}

    public async getAllUsers(): Promise<UserDTO[]> {
        const users = await this.userRepository.findAll()
        return users.map(user => plainToClass(UserDTO, user))
    }
    
    public async register({username, password, role}: {username: string, password: string, role: Role}) {
        const hashedPassword = await this.encryptionService.hashPassword(password)
        const existsUser = await this.userRepository.findByUsername(username)
        if(existsUser) throw new BackendException(MsgCode.OOPS_ERROR)
        const savedUser = await this.userRepository.save(username, hashedPassword, role)
        return savedUser
    }

    public async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findByUsername(username)
    }
}