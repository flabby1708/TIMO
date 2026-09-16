import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard.js';
import { UsersService } from './users.service.js';
import { UserRole } from './entities/user.entity.js';
import { RoleGuard } from '../common/guards/role.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getMe(@Req() request: any) {
    const userId = request.user.sub;

    const user = await this.usersService.findById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Get user information successfully',
      user,
    };
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.COOKER)
  @Get('cooker-test')
  cookerTest() {
    return {
      message: 'You are a cooker',
    };
  }
}
