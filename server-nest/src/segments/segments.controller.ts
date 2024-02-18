import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SegmentWithAggregatedValue } from './interfaces/segment.interface';
import { SegmentsService } from './segments.service';

@Controller('segments')
export class SegmentsController {

    @Inject(ConfigService)
    public config: ConfigService;


    constructor(private readonly segmentsService: SegmentsService) {}


    @Get('/polygon/:points')
    getSegmentsInPolygon(@Param() params, @Query() query: { type: string, aggregation: string, direction: number }): Promise<SegmentWithAggregatedValue[]>{
        const pointsList = params.points.split(";")
        const type = query.type;
        const direction = query.direction;
        const aggregation = query.aggregation;
        return this.segmentsService.getSegmentsInPolygonWithAggregatedValues(pointsList, type, aggregation, direction);
    }

    @Get(':segment_id')
    getSegmentAndValue(@Param() params, @Query() query: { type: string, aggregation: string }): Promise<SegmentWithAggregatedValue>{
        const segment_id = params.segment_id
        const type = query.type;
        const aggregation = query.aggregation;
        return this.segmentsService.getSegmentWithAggregatedValue(segment_id , type, aggregation);
        
    }



}

