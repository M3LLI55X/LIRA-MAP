// László Barak - s222899, Gustav F. H. Siegfried - s204490, Peter Frederiksen - s204484 and Mathias Jensen - s204480
import { Controller, Get, Header, Query, Res, StreamableFile } from '@nestjs/common';
import { RidesService } from './rides.service';

import { BoundedPath } from 'src/models';
import { LocalRidesService } from './local-rides.service';
import { RideMeta } from './models.rides';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('rides')
export class RidesController 
{

    constructor(private readonly service: RidesService, private readonly localService: LocalRidesService) {}

    // Gustav F. H. Siegfried - s204490, Peter Frederiksen - s204484 and Mathias Jensen - s204480
    @Get()
    getRides(): Promise<RideMeta[]> {
        return this.service.getRides();
    }
    @Get('/ride')
    getRide( @Query() query: { queryType: string, queryRequest: string, dbName: string } ): Promise<BoundedPath> {
        const { queryType, queryRequest, dbName } = query
        console.log("[rides.controller] " + queryRequest)
        if (dbName == "energy_consumption") {
            return this.localService.getEnergyConsumption( queryType, queryRequest );
        } else {
            return this.service.getRide( queryRequest, dbName );
        }
    }
    // László Barak - s222899
    @Get('/generateData')
    @Header('Content-Type', 'application/csv')
    async generateData( @Query() query: { queryType: string, queryRequest: string} ): Promise<StreamableFile > {
        const { queryType, queryRequest } = query

        const path = await this.localService.generateEnergyConsumptionCsv(queryRequest, queryType)

        const file = createReadStream(join(process.cwd(), path));
        return new StreamableFile(file);
    }
}
