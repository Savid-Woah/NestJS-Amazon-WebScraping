import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { UserController } from "../controller/UserController";
import { UserService } from "../service/UserService";
import { UserRepository } from "../repository/UserRepository";
import { EncryptionService } from "../../encrypt/service/EncryptionService";

@Module({
    controllers: [UserController],
    providers: [
        UserService, 
        UserRepository, 
        EncryptionService
    ],
    imports: [PrismaModule]
})
export class UserModule {
}