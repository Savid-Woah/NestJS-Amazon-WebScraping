import { Injectable } from '@nestjs/common';
import { I18nService  } from 'nestjs-i18n';
import { MsgCode } from './MsgCode';

@Injectable()
export class MessageTextResolver {

    constructor(private readonly i18n: I18nService) {}

    async getMessage(msgCode: MsgCode, lang: string): Promise<string> {
        return this.i18n.translate(`messages.${msgCode.languageKey}`, { lang });
    }
}
