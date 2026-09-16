import { Test, TestingModule } from '@nestjs/testing';
import { CookingRequestsService } from './cooking-requests.service.js';

describe('CookingRequestsService', () => {
  let service: CookingRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookingRequestsService],
    }).compile();

    service = module.get<CookingRequestsService>(CookingRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
