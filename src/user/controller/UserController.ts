import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "../service/UserService";
import { Role } from "../enum/Role";
import { ResponseHandler } from "../../response/handler/ResponseHandler";
import { Message } from "../../response/message/Message";

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('register')
    public async register(@Body() {username, password, role}: {username: string, password: string, role: Role}) {
        const userRegistered = await this.userService.register({username, password, role})
        const userDTO = {password, ...userRegistered}
        return ResponseHandler.generateResponse(userDTO, HttpStatus.CREATED, Message.USER_REGISTERED)
    }
}