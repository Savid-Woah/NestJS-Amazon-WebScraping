import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRequest } from "../request/LoginRequest";
import { EncryptionService } from "../../encrypt/service/EncryptionService";
import { MsgCode } from "../../exception/MsgCode";
import { BackendException } from "../../exception/BackendException";
import { Role } from "../../user/enum/Role";
import { UserService } from "../../user/service/UserService";

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly encryptionService: EncryptionService
    ) {}

    public async validateUser({username, password}: LoginRequest) {

        const userOptional = await this.userService.getUserByUsername(username);

        if (!userOptional) {
            throw new BackendException(MsgCode.INVALID_CREDENTIALS);
        }
    
        const passwordsMatch = await this.encryptionService.comparePasswords(password, userOptional.password);
    
        if (passwordsMatch) {
            const { password, ...user } = userOptional;
            return this.jwtService.sign(user)
        } else {
            throw new BackendException(MsgCode.INVALID_CREDENTIALS)
        }
    }

    public async validateOAuthUser({username}: {username: string}) {
        
        let user = await this.userService.getUserByUsername(username)

        // Users that authenticated with oAuth do not need an in-system password - no pasword will be assigned
        if(!user) user = await this.userService.register({username: username, password: '', role: Role.USER})

        const { password, ...userDTO } = user
        
        return this.jwtService.sign(userDTO)
    }
}