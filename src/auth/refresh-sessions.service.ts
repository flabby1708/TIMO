import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { RefreshSession } from './entities/refresh-session.entity.js';

@Injectable()
export class RefreshSessionsService {
  constructor(
    @InjectRepository(RefreshSession)
    private readonly refreshSessionRepository: Repository<RefreshSession>,
  ) {}

  async create(data: Partial<RefreshSession>): Promise<RefreshSession> {
    const session = this.refreshSessionRepository.create(data);

    return await this.refreshSessionRepository.save(session);
  }
  async findActiveByUserId(userId: string): Promise<RefreshSession[]> {
    return await this.refreshSessionRepository.find({
      where: {
        userId,
        revokedAt: IsNull(),
      },
    });
  }
  async revoke(sessionId: string): Promise<void> {
    await this.refreshSessionRepository.update(sessionId, {
      revokedAt: new Date(),
    });
  }
  async findById(id: string): Promise<RefreshSession | null> {
    return await this.refreshSessionRepository.findOne({
      where: { id },
    });
  }
}
