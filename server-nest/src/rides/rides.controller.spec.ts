// Gustav F. H. Siegfried - s204490
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_MAIN_TOKEN, OUR_DB_TOKEN } from '../../test/injectToken';
import { LocalRidesService } from './local-rides.service';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';

describe('RidesController', () => {
	let controller: RidesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RidesController],
			providers: [RidesService, LocalRidesService, ConfigService, OUR_DB_TOKEN, LIRA_MAIN_TOKEN],
		}).compile();

		controller = module.get<RidesController>(RidesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
