// Original code was given to us, but fixed by Gustav F. H. Siegfried - s204490
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_VIS_TOKEN } from '../../test/injectToken';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

describe('TypesController', () => {
  let controller: TypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesController],
      providers: [TypesService, LIRA_VIS_TOKEN],
    }).compile();

    controller = module.get<TypesController>(TypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
