import { Injectable } from "@nestjs/common";
import { BackendException } from "../../exception/BackendException";
import { MsgCode } from "../../exception/MsgCode";
import { PrismaService } from "../../prisma/prisma.service";
import { Role } from "../enum/Role";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) { }

    public async findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    public async findByUsername(username: string): Promise<User> {
        return await this.prisma.user.findFirst({where: {username: username}})
    }

    public async findById(userId: string): Promise<User> {
        return await this.prisma.user.findFirst({where: {id: userId}})
    }

    public async save(username: string, password: string, role: Role) {
        try {
    
            const user = await this.prisma.user.create({
                data: {
                    username: username,
                    password: password,
                    roles: [role]
                },
            });

            return user;

        } catch (error) {
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION);
        }
    }
}