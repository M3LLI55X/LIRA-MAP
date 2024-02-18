// Original code was given to us, but fixed by Gustav F. H. Siegfried - s204490
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_VIS_TOKEN } from '../../test/injectToken';
import { TypesService } from './types.service';

describe('TypesService', () => {
  let service: TypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesService, LIRA_VIS_TOKEN],
    }).compile();

    service = module.get<TypesService>(TypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
