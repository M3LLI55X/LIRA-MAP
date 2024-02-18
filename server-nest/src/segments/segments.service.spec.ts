// Original code was given to us, but fixed by Gustav F. H. Siegfried - s204490
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_VIS_TOKEN } from '../../test/injectToken';
import { SegmentsService } from './segments.service';

describe('SegmentsService', () => {
  let service: SegmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SegmentsService, LIRA_VIS_TOKEN],
    }).compile();

    service = module.get<SegmentsService>(SegmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
