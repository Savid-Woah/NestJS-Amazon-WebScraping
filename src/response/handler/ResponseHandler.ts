import { HttpStatus } from "@nestjs/common";
import { Message } from "../message/Message";

export class ResponseHandler {

    public static generateResponse(data: any, status: HttpStatus, message: Message): {} {
        return {
            data: data,
            status: status,
            message: message
        }
    }
}