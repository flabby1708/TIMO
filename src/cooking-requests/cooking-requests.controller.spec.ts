import { Test, TestingModule } from '@nestjs/testing';
import { CookingRequestsController } from './cooking-requests.controller.js';
import { CookingRequestsService } from './cooking-requests.service.js';

describe('CookingRequestsController', () => {
  let controller: CookingRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookingRequestsController],
      providers: [CookingRequestsService],
    }).compile();

    controller = module.get<CookingRequestsController>(CookingRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
