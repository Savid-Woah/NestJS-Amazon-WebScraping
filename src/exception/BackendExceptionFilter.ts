import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { MessageTextResolver } from './MessageTextResolver';
import { BackendException } from './BackendException';

@Catch(BackendException)
export class BackendExceptionFilter implements ExceptionFilter {

    constructor(private readonly messageTextResolver: MessageTextResolver) {}

    async catch(exception: BackendException, host: ArgumentsHost) {
        
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        const msgCode = exception.msgCode;
        const lang = exception.getLanguage(request);
        const message = await this.messageTextResolver.getMessage(msgCode, lang);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            errorCode: msgCode.code,
            message
        });
    }
}
