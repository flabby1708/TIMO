import { PartialType } from '@nestjs/mapped-types';
import { CreateCookingRequestDto } from './create-cooking-request.dto.js';

export class UpdateCookingRequestDto extends PartialType(CreateCookingRequestDto) {}
