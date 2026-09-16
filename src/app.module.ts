import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtConfigModule } from './common/jwt-config.module.js';
import { CookingRequestsModule } from './cooking-requests/cooking-requests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.getOrThrow<string>('DATABASE_HOST'),

        port: Number(
          configService.getOrThrow<string>('DATABASE_PORT'),
        ),

        username:
          configService.getOrThrow<string>(
            'DATABASE_USERNAME',
          ),

        password:
          configService.getOrThrow<string>(
            'DATABASE_PASSWORD',
          ),

        database:
          configService.getOrThrow<string>(
            'DATABASE_NAME',
          ),

        autoLoadEntities: true,

        synchronize:
          configService.get<string>(
            'DATABASE_SYNCHRONIZE',
          ) === 'true',
      }),
    }),

    UsersModule,
    AuthModule,
    JwtConfigModule,
    CookingRequestsModule
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}