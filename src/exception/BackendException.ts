import { HttpException, HttpStatus } from '@nestjs/common';
import { MsgCode } from './MsgCode';
import { Request } from 'express';

export class BackendException extends HttpException {
    
    constructor(public msgCode: MsgCode,) {super('', HttpStatus.INTERNAL_SERVER_ERROR);}

    getLanguage(request: Request): string {
        return request['resolvedLang'] || 'en';
    }
}