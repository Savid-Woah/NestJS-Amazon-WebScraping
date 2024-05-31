import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductModule } from './product/module/ProductModule';
import { AuthModule } from './auth/module/AuthModule';
import { UserModule } from './user/module/UserModule';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './user/guard/RolesGuard';
import { APP_FILTER, Reflector } from '@nestjs/core';
import { MyLoggerModule } from './logger/module/LoggerModule';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  I18nContext,
} from 'nestjs-i18n';
import * as path from 'path';
import { BackendExceptionFilter } from './exception/BackendExceptionFilter';
import { MessageTextResolver } from './exception/MessageTextResolver';
import { LocaleResolverMiddleware } from './exception/LocaleResolverMiddleware';
import { ScrappingModule } from './scraping/module/ScrapingModule';
import { NotificationModule } from './notification/module/NotificationModule';
import { MyWebsocketGatewayModule } from './websocket/MyWebSocketGateWayModule';
import { ScheduleModule } from '@nestjs/schedule';
import { EncryptionModule } from './encrypt/module/EncryptionModule';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    MyLoggerModule,
    ScrappingModule,
    EncryptionModule,
    NotificationModule,
    MyWebsocketGatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    Reflector,
    RolesGuard,
    I18nContext,
    MessageTextResolver,
    {
      provide: APP_FILTER,
      useClass: BackendExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocaleResolverMiddleware).forRoutes('*');
  }
}
