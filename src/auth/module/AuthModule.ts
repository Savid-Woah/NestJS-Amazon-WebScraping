import { Module } from '@nestjs/common';
import { AuthController } from '../controller/AuthController';
import { AuthService } from '../service/AuthService';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../strategy/LocalStrategy';
import { JwtStrategy } from '../strategy/JwtStrategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { GoogleStrategy } from '../strategy/GoogleStrategy';
import { SessionSerializer } from '../serializer/Serializer';
import { FacebookStrategy } from '../strategy/FacebookStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../encrypt/service/EncryptionService';
import { UserRepository } from '../../user/repository/UserRepository';
import { UserService } from '../../user/service/UserService';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    UserService,
    LocalStrategy,
    UserRepository,
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
    EncryptionService,
  ],
})
export class AuthModule {}
