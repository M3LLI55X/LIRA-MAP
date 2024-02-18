// Original code was given to us, but fixed by Gustav F. H. Siegfried - s204490
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LIRA_VIS_TOKEN } from '../../test/injectToken';
import { SegmentsController } from './segments.controller';
import { SegmentsService } from './segments.service';

describe('SegmentsController', () => {
	let controller: SegmentsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SegmentsController],
			providers: [SegmentsService, ConfigService, LIRA_VIS_TOKEN],
		}).compile();

		controller = module.get<SegmentsController>(SegmentsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
