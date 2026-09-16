import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }
}
