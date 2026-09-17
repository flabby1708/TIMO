import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCookingRequestDto } from './dto/create-cooking-request.dto.js';
import { UpdateCookingRequestDto } from './dto/update-cooking-request.dto.js';

import {
  CookingRequest,
  CookingRequestStatus,
} from './entities/cooking-request.entity.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class CookingRequestsService {
  constructor(
    @InjectRepository(CookingRequest)
    private readonly cookingRequestRepository: Repository<CookingRequest>,
  ) {}

  async create(
    customerId: string,
    dto: CreateCookingRequestDto,
  ): Promise<CookingRequest> {
    const cookingRequest = this.cookingRequestRepository.create({
      ...dto,
      scheduledAt: new Date(dto.scheduledAt),
      customerId,
      cookerId: null,
    });

    return await this.cookingRequestRepository.save(cookingRequest);
  }

  async findOpen(): Promise<CookingRequest[]> {
    return await this.cookingRequestRepository.find({
      where: {
        status: CookingRequestStatus.OPEN,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async accept(requestId: string, cookerId: string): Promise<CookingRequest> {
    const cookingRequest = await this.cookingRequestRepository.findOne({
      where: {
        id: requestId,
      },
    });

    if (!cookingRequest) {
      throw new NotFoundException('Cooking request not found');
    }

    if (cookingRequest.status !== CookingRequestStatus.OPEN) {
      throw new BadRequestException('Cooking request is not open');
    }

    cookingRequest.cookerId = cookerId;
    cookingRequest.status = CookingRequestStatus.ACCEPTED;

    return await this.cookingRequestRepository.save(cookingRequest);
  }

  async cancel(requestId: string, customerId: string): Promise<CookingRequest> {
    const cookingRequest = await this.cookingRequestRepository.findOne({
      where: {
        id: requestId,
      },
    });

    if (!cookingRequest) {
      throw new NotFoundException('Cooking request not found');
    }

    if (cookingRequest.customerId !== customerId) {
      throw new ForbiddenException('You cannot cancel this cooking request');
    }

    if (
      cookingRequest.status === CookingRequestStatus.COMPLETED ||
      cookingRequest.status === CookingRequestStatus.CANCELLED
    ) {
      throw new BadRequestException('Cooking request cannot be cancelled');
    }

    cookingRequest.status = CookingRequestStatus.CANCELLED;

    return await this.cookingRequestRepository.save(cookingRequest);
  }

  async complete(requestId: string, cookerId: string): Promise<CookingRequest> {
    const cookingRequest = await this.cookingRequestRepository.findOne({
      where: {
        id: requestId,
      },
    });

    if (!cookingRequest) {
      throw new NotFoundException('Cooking request not found');
    }

    if (cookingRequest.cookerId !== cookerId) {
      throw new ForbiddenException('You cannot complete this cooking request');
    }

    if (cookingRequest.status !== CookingRequestStatus.ACCEPTED) {
      throw new BadRequestException('Cooking request is not accepted');
    }

    cookingRequest.status = CookingRequestStatus.COMPLETED;

    return await this.cookingRequestRepository.save(cookingRequest);
  }

  async findMyRequests(customerId: string): Promise<CookingRequest[]> {
    return await this.cookingRequestRepository.find({
      where: {
        customerId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAll() {
    return 'This action returns all cookingRequests';
  }

  async findOne(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<CookingRequest> {
    const cookingRequest = await this.cookingRequestRepository.findOne({
      where: { id },
    });

    if (!cookingRequest) {
      throw new NotFoundException('Cooking request not found');
    }

    if (role === UserRole.CUSTOMER && cookingRequest.customerId !== userId) {
      throw new ForbiddenException('You cannot view this cooking request');
    }

    if (role === UserRole.COOKER && cookingRequest.cookerId !== userId) {
      throw new ForbiddenException('You cannot view this cooking request');
    }

    return cookingRequest;
  }

  update(id: string, updateCookingRequestDto: UpdateCookingRequestDto) {
    return `This action updates a #${id} cookingRequest`;
  }

  remove(id: string) {
    return `This action removes a #${id} cookingRequest`;
  }
}
