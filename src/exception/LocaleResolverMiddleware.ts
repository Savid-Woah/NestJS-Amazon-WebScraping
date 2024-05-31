import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocaleResolverMiddleware implements NestMiddleware {
  
    use(req: Request, res: Response, next: NextFunction) {
        const acceptLanguage = req.headers['accept-language'];
        const lang = acceptLanguage ? acceptLanguage.toString().split(',')[0] : 'en';
        req['resolvedLang'] = lang;
        next();
    }
}
