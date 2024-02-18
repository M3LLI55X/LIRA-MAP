// László Barak - s222899, Gustav F. H. Siegfried - s204490, Peter Frederiksen - s204484 and Mathias Jensen - s204480
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { BoundedPath, PointData } from 'src/models';

export interface Energy_Consumption {
    energyConsumption: number
    lat: number
    lon: number
    TS: Date
}

@Injectable()
export class LocalRidesService
{
    constructor(@InjectConnection('our-db') private readonly knex: Knex) {}

    // László Barak - s222899, Gustav F. H. Siegfried - s204490, Peter Frederiksen - s204484 and Mathias Jensen - s204480
    async getEnergyConsumption( queryType : string, queryRequest: string): Promise<BoundedPath>
    {
        console.log("[local-rides.service] " + queryRequest)
        let res: Energy_Consumption[]
        if (queryType == 'FK_Trip') {
            res = await this.knex
            .select( [ 'energyConsumption', 'lat', 'lon', 'TS' ] )
            .from( { public: 'Energy_Consumption' } )
            .where( { 'FK_Trip': queryRequest } )
        } else if (queryType == 'Municipality') {
            console.log("I'm here.")
            res = await this.knex
            .select( [ 'energyConsumption', 'lat', 'lon', 'TS' ] )
            .from( { public: 'Energy_Consumption' } )
            .where( { 'Municipality': queryRequest } )
        } else {
            console.log("[local-rides.service] I should not be in this else.")
        }

        let minX = new Date(Number.MAX_SAFE_INTEGER).getTime();
        let maxX = new Date(Number.MIN_SAFE_INTEGER).getTime();
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;
        const path = Object.values(res)
            .map( (msg: any) => {
                const value = msg.energyConsumption
                const timestamp = new Date( msg.TS )

                minX = Math.min(minX, timestamp.getTime());
                maxX = Math.max(maxX, timestamp.getTime());
                minY = Math.min(minY, value)
                maxY = Math.max(maxY, value)

                return { lat: msg.lat, lng: msg.lon, value, metadata: { timestamp } } as PointData
            } )
            .sort( (a: PointData, b: PointData) =>
                a.metadata.timestamp - b.metadata.timestamp
            )

        return { path, bounds: { minX, maxX, minY, maxY } }
    }

    //Laszló Barak - s222899
    async generateEnergyConsumptionCsv( queryRequest: string, queryType: string)
    {
        console.log(queryRequest)
        console.log(queryType)
        let res: Energy_Consumption[]
        if (queryType == 'FK_Trip') {
            res = await this.knex
            .select( [ 'energyConsumption', 'lat', 'lon', 'TS' ] )
            .from( { public: 'Energy_Consumption' } )
            .where( { 'FK_Trip': queryRequest } )
        } else if (queryType == 'Municipality') {
            console.log("I'm here.")
            res = await this.knex
            .select( [ 'energyConsumption', 'lat', 'lon', 'TS' ] )
            .from( { public: 'Energy_Consumption' } )
            .where( { 'Municipality': queryRequest } )
        } else {
            console.log("[local-rides.service] I should not be in this else.")
        }
        
        //var res2 = res as any[];
        //res2.map(row => row.TS = row.TS.toISOString())
        console.log(res.length)
        var data = ''
        data = data + Object.keys(res[0]).join(',') + '\r\n'
        res.map(row => data = data + Object.values(row).join(',')  + '\r\n')

        var dataFolder = '../data'
        if (!existsSync(dataFolder)) {
            mkdirSync(dataFolder);
        }

        writeFileSync(`${dataFolder}/${queryRequest}.csv`, data)

        console.log(`file saved to ${queryRequest}.csv`)

        return `${dataFolder}/${queryRequest}.csv`
    }
}
