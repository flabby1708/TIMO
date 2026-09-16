import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { Auth } from '../auth/entities/auth.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtConfigModule } from '../common/jwt-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtConfigModule  
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService,
  ],  
  exports: [
    UsersService,
  ],
})
export class UsersModule {}