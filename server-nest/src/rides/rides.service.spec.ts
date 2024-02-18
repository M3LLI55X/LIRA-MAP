// Gustav F. H. Siegfried - s204490
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_MAIN_TOKEN } from '../../test/injectToken';
import { RidesService } from './rides.service';

describe('RidesService', () => {
  let service: RidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RidesService, LIRA_MAIN_TOKEN],
    }).compile();

    service = module.get<RidesService>(RidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
