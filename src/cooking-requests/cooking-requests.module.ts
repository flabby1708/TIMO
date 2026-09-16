import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CookingRequestsService } from './cooking-requests.service.js';
import { CookingRequestsController } from './cooking-requests.controller.js';
import { CookingRequest } from './entities/cooking-request.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([CookingRequest]), AuthModule],
  controllers: [CookingRequestsController],
  providers: [CookingRequestsService],
})
export class CookingRequestsModule {}
