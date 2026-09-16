import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshSessionsService } from './refresh-sessions.service.js';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register-auth.dto.js';
import { LoginDto } from './dto/login-auth-dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RefreshSession } from './entities/refresh-session.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshSessionsService: RefreshSessionsService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: dto.role,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = randomUUID();

    const accessPayload = {
      sub: user.id,
      role: user.role,
      type: 'access',
    };

    const refreshPayload = {
      sub: user.id,
      role: user.role,
      sid: sessionId,
      type: 'refresh',
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: '7d',
    });

    const tokenHash = await bcrypt.hash(refreshToken, 12);

    await this.refreshSessionsService.create({
      id: sessionId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revokedAt: null,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(dto: RefreshTokenDto) { 
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const session = await this.refreshSessionsService.findById(payload.sid);

    if (!session) {
      throw new UnauthorizedException('Refresh session not found');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Refresh session revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh session expired');
    }

    const matches = await bcrypt.compare(dto.refreshToken, session.tokenHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const newPayload = {
      sub: payload.sub,
      role: payload.role,
      type: 'access',
    };

    const accessToken = await this.jwtService.signAsync(newPayload, {
      expiresIn: '15m',
    });

    return {
      accessToken,
    };
  }

  async logout(dto: RefreshTokenDto) {
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh' || !payload.sid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.refreshSessionsService.findById(payload.sid);

    if (!session) {
      throw new UnauthorizedException('Refresh session not found');
    }

    const matches = await bcrypt.compare(dto.refreshToken, session.tokenHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshSessionsService.revoke(payload.sid);

    return {
      message: 'Logout successfully',
    };
  }
}
