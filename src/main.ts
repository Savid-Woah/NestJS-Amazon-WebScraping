import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { LoggerService } from './logger/service/LoggerService';
import { BackendException } from './exception/BackendException';
import { MsgCode } from './exception/MsgCode';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://accounts.google.com']
const ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
const ALLOWED_HEADERS = ['Content-Type', 'Authorization']
const EXPOSED_HEADERS = ['Content-Length', 'X-Kuma-Revision']

class MyIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions): any {
        const optionsWithCors: ServerOptions = {
            ...options,
            cors: {
                origin: (origin, callback) => {
                    if (ALLOWED_ORIGINS.includes(origin) || !origin) {
                        callback(null, true);
                    } else {
                        callback(new BackendException(MsgCode.OOPS_ERROR));
                    }
                },
                methods: ALLOWED_METHODS,
                allowedHeaders: ALLOWED_HEADERS,
                exposedHeaders: EXPOSED_HEADERS,
                credentials: true,
            },
        };
        return super.createIOServer(port, optionsWithCors);
    }
}

async function bootstrap() {
    
    const app = await NestFactory.create(AppModule, {bufferLogs: true})

    const configService = app.get(ConfigService)

    app.useLogger(app.get(LoggerService))
    
    app.use(
        session({
            secret: configService.get<string>('SESSION_SECRET'),
            saveUninitialized: false,
            resave: false,
            cookie: {maxAge: 60000}
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())

    app.enableCors({

        origin: (origin, callback) => {
            if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new BackendException(MsgCode.OOPS_ERROR));
            }
        },
        methods: ALLOWED_METHODS,
        allowedHeaders: ALLOWED_HEADERS,
        exposedHeaders: EXPOSED_HEADERS,
        credentials: true,
        maxAge: 60000,
    });

    app.useWebSocketAdapter(new MyIoAdapter(app))
    app.setGlobalPrefix('api/v1')
    await app.listen(3001)
}
bootstrap()
