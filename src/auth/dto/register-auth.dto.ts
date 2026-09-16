import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../users/entities/user.entity.js';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}