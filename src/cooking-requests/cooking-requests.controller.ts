import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CookingRequestsService } from './cooking-requests.service.js';
import { CreateCookingRequestDto } from './dto/create-cooking-request.dto.js';

import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RoleGuard } from '../common/guards/role.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';
import { CookingRequestStatus } from './entities/cooking-request.entity.js';
import { FilterCookingRequestsDto } from './dto/filter-cooking-requests.dto.js';

@Controller('cooking-requests')
export class CookingRequestsController {
  constructor(
    private readonly cookingRequestsService: CookingRequestsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.CUSTOMER)
  async create(@Req() request: any, @Body() dto: CreateCookingRequestDto) {
    const customerId = request.user.sub;

    return await this.cookingRequestsService.create(customerId, dto);
  }

  @Get('open')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.COOKER)
  async findOpen() {
    return await this.cookingRequestsService.findOpen();
  }

  @Get('my')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.CUSTOMER)
  async findMyRequests(
    @Req() request: any,
    @Query() query: FilterCookingRequestsDto,
  ) {
    const customerId = request.user.sub;

    return await this.cookingRequestsService.findMyRequests(
      customerId,
      query.status,
    );
  }

  @Get('my-jobs')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.COOKER)
  async findMyJobs(
    @Req() request: any,
    @Query() query: FilterCookingRequestsDto,
  ) {
    const cookerId = request.user.sub;

    return await this.cookingRequestsService.findMyJobs(cookerId, query.status);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.CUSTOMER, UserRole.COOKER)
  async findOne(@Param('id') id: string, @Req() request: any) {
    const userId = request.user.sub;
    const role = request.user.role;

    return await this.cookingRequestsService.findOne(id, userId, role);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.CUSTOMER)
  async cancel(@Param('id') id: string, @Req() request: any) {
    const customerId = request.user.sub;

    return await this.cookingRequestsService.cancel(id, customerId);
  }

  @Patch(':id/accept')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.COOKER)
  async accept(@Param('id') id: string, @Req() request: any) {
    const cookerId = request.user.sub;

    return await this.cookingRequestsService.accept(id, cookerId);
  }

  @Patch(':id/complete')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.COOKER)
  async complete(@Param('id') id: string, @Req() request: any) {
    const cookerId = request.user.sub;

    return await this.cookingRequestsService.complete(id, cookerId);
  }
}
