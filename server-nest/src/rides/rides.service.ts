// László Barak - s222899 and Gustav Frederik Heide Siegfried - s204490
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';

import { BoundedPath, PointData } from 'src/models';
import { RideMeta } from './models.rides';

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {
        return await this.knex
            .select( '*' )
            .from( { public: 'Trips' } )
            .whereNot( 'TaskId', 0 )
            .orderBy('TaskId')
    }

    async getEnergyConsumptioon(tripId: string, dbName: string): Promise<BoundedPath> {
        var res = await this.knex
        .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
        .from( { public: 'Measurements' } )
        .where( { 'FK_Trip': tripId, 'T': 'obd.acc_long' } )
        .whereNot( { 'lat': null, 'lon': null } )

        const acc = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message);
                const value = json['obd.acc_long' + '.value'];
                const timestamp = new Date( msg.Created_Date )
                
                return { lat: msg.lat, lon: msg.lon, value, metadata: { timestamp} }
            } )

        res = await this.knex
        .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
        .from( { public: 'Measurements' } )
        .where( { 'FK_Trip': tripId, 'T': 'obd.spd_veh' } )
        .whereNot( { 'lat': null, 'lon': null } )

        const speed = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message);
                const value = json['obd.spd_veh' + '.value'];
                const timestamp = new Date( msg.Created_Date )
                
                return { lat: msg.lat, lon: msg.lon, value, metadata: { timestamp} }
            } )

        res = await this.knex
        .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
        .from( { public: 'Measurements' } )
        .where( { 'FK_Trip': tripId, 'T': "obd.whl_trq_est" } )
        .whereNot( { 'lat': null, 'lon': null } )
    
        const torque = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message);
                const value = json['obd.whl_trq_est' + '.value'];
                const timestamp = new Date( msg.Created_Date )

                return { lat: msg.lat, lon: msg.lon, value, metadata: { timestamp}}
            } )

        let minX = new Date(Number.MAX_SAFE_INTEGER).getTime();
        let maxX = new Date(Number.MIN_SAFE_INTEGER).getTime();
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;

        console.log("Starting the energy consumption calculation")
        var returnValue = acc.filter( (point, index) => {
            return index % 1000 == 0
        }).map((point, index) => {
            console.log(index + " out of " + acc.length)

            var timestamp = point.metadata.timestamp

            var spdBefore = {
                lat: 0,
                lon: 0,
                value: 0,
                metadata: {
                    timestamp: new Date()
                }
            }

            var spdBeforeFiltered  = speed.filter((spdPoint) => {
                return spdPoint.metadata.timestamp <= timestamp
            })
            if (spdBeforeFiltered.length > 2) {
                spdBefore = spdBeforeFiltered.reduce(function(prev, current) {
                    return (prev.metadata.timestamp > current.metadata.timestamp) ? prev : current
                })
            }

            var spdAfter = {
                lat: 0,
                lon: 0,
                value: 0,
                metadata: {
                    timestamp: new Date()
                }
            }

            var spdAfterFiltered  = speed.filter((spdPoint) => {
                return spdPoint.metadata.timestamp >= timestamp
            })
            if (spdAfterFiltered.length > 2) {
                spdAfter = spdAfterFiltered.reduce(function(prev, current) {
                    return (prev.metadata.timestamp < current.metadata.timestamp) ? prev : current
                })
            }

            var spd = (spdAfter.value - spdBefore.value) / (spdAfter.metadata.timestamp.valueOf() - spdBefore.metadata.timestamp.valueOf())
                        * (timestamp.valueOf() - spdBefore.metadata.timestamp.valueOf()) + spdBefore.value

            var trqBefore = {
                lat: 0,
                lon: 0,
                value: 0,
                metadata: {
                    timestamp: new Date()
                }
            }
            var trqBeforeFiltered  = torque.filter((spdPoint) => {
                return spdPoint.metadata.timestamp <= timestamp
            })
            if (trqBeforeFiltered.length > 2){
                trqBefore = trqBeforeFiltered.reduce(function(prev, current) {
                    return (prev.metadata.timestamp > current.metadata.timestamp) ? prev : current
                })
            }

            var trqAfter = {
                lat: 0,
                lon: 0,
                value: 0,
                metadata: {
                    timestamp: new Date()
                }
            }
            var trqAfterFiltered  = torque.filter((spdPoint) => {
                return spdPoint.metadata.timestamp >= timestamp
            })
            if (trqAfterFiltered.length > 2){
                trqAfter = trqAfterFiltered.reduce(function(prev, current) {
                    return (prev.metadata.timestamp < current.metadata.timestamp) ? prev : current
                })
            }
            
            var trq = (trqAfter.value - trqBefore.value) / (trqAfter.metadata.timestamp.valueOf() - trqBefore.metadata.timestamp.valueOf())
                        * (timestamp.valueOf() - trqBefore.metadata.timestamp.valueOf()) + trqBefore.value
            
            const wheel_radius = 0.3
            const WattConv = 1.0/3600.0
            const window_length = 10.0
            const g = 9.80665
            const vehicle_mass = 1584
            const JtoW = 1/3600
            const cd = 0.29
            const rho = 1.225
            const A = 2.3316

            var Fslope = vehicle_mass*g*point.value
            var Eslope = JtoW*Fslope*window_length

            var Facc = vehicle_mass*point.value
            var Eacc = JtoW*Facc*window_length

            var Faero = 0.5*rho*A*cd*spd**2
            var Eaero = JtoW*Faero*window_length

            var fric = trq - Eslope - Eacc - Eaero

            minX = Math.min(minX, point.metadata.timestamp.valueOf());
            maxX = Math.max(maxX, point.metadata.timestamp.valueOf());
            minY = Math.min(minY, fric)
            maxY = Math.max(maxY, fric)

            return { lat: point.lat, lng: point.lon, value:fric, metadata: point.metadata} as PointData
        }).sort( (a: PointData, b: PointData) =>
            a.metadata.timestamp - b.metadata.timestamp
        )

        console.log("Finished the energy consumption calculation")
        return { path:returnValue, bounds: { minX, maxX, minY, maxY } }
    }

    async getRide( tripId: string, dbName: string ): Promise<BoundedPath>
    {
        console.log(tripId, dbName);
        
        const res = await this.knex
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': dbName } )
            .whereNot( { 'lat': null, 'lon': null } )

        let minX = new Date(Number.MAX_SAFE_INTEGER).getTime();
        let maxX = new Date(Number.MIN_SAFE_INTEGER).getTime();
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;

        const path = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message);
                const value = json[dbName + '.value'];
                const timestamp = new Date( msg.Created_Date )

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
}
