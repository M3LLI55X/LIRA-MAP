// Gustav F. H. Siegfried - s204490
import { Test, TestingModule } from '@nestjs/testing';
import { BoundedPath } from 'src/models';
import { OUR_DB_TOKEN } from '../../test/injectToken';
import { LocalRidesService } from './local-rides.service';

function isBoundedPath(obj: any): obj is BoundedPath {
  return 'path' in obj && 'bounds' in obj;
}

describe('LocalRidesService', () => {
  let service: LocalRidesService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalRidesService, OUR_DB_TOKEN],
    }).compile();
    
    service = module.get<LocalRidesService>(LocalRidesService);
  });
  
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  
  it('should get a BoundedPath object from the database', async () => {
    expect(service).toBeDefined();
    let data : BoundedPath = await service.getEnergyConsumption("FK_Trip", "3decdffe-5c6e-4f3c-a4ea-868ca34a3d22");
    expect(isBoundedPath(data)).toBeTruthy;
  });
});