import {
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCookingRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsDateString()
  scheduledAt: string;
}