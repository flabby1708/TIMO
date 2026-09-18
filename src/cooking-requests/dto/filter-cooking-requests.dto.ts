import { IsEnum, IsOptional } from 'class-validator';
import { CookingRequestStatus } from '../entities/cooking-request.entity.js';

export class FilterCookingRequestsDto {
  @IsOptional()
  @IsEnum(CookingRequestStatus)
  status?: CookingRequestStatus;
}