import { Test, TestingModule } from '@nestjs/testing';
import { ScholarsController } from './scholars.controller';

describe('ScholarsController', () => {
  let controller: ScholarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScholarsController],
    }).compile();

    controller = module.get<ScholarsController>(ScholarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
