import { RefreshSessionsService } from './refresh-sessions.service.js';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RefreshSession } from './entities/refresh-session.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    TypeOrmModule.forFeature([
      RefreshSession,
    ]),
  ],

  controllers: [AuthController],
  providers: [
    AuthService, 
    RefreshSessionsService,
  ],
  exports: [JwtModule ],
})
export class AuthModule {}