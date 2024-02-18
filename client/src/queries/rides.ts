// Peter Frederiksen - s204484 and Mathias Jensen - s204480
import { Dispatch, SetStateAction } from "react"
import { RideMeta } from "../models/models"
import { BoundedPath, Metadata } from "../models/path"
import { PopupFunc } from "../models/popup"
import { ActiveMeasProperties } from "../models/properties"
import { asyncPost, get } from "./fetch"


export const getRides = ( callback: Dispatch<SetStateAction<RideMeta[]>> ) => {
    get( '/rides', callback )
}

export const getRide = async (
    measurement: ActiveMeasProperties, 
    meta: Metadata, 
    popup: PopupFunc,
    queryType: string
) => {
    const { dbName, name, hasValue } = measurement
    let data = undefined
    let path = undefined
    let titleText
    let footerText
    if (queryType === "FK_Trip") {
        const { TripId: tripId, TaskId: taskId } = meta;
        console.log('Querying measurement:', name, '\nTaskId:', taskId );
        
        const queryRequest = tripId
        const result = await asyncPost<BoundedPath>( '/rides/ride', { queryType, queryRequest, dbName } )
        data = result.data   
        path = data.path;
    
        console.log("Got data for ride:", taskId, "\nLength:", path.length, "\nMeasurement:", name, "\nHasValue?:", hasValue );

        titleText = "This trip doesn't contain data for " + name
        footerText = "TripId: " + tripId + "TaskId: " + taskId
    } else {
        const queryRequest = queryType
        console.log('Querying "' + name + '" for the municipality "' + queryRequest + '".');
        
        queryType = "Municipality"
        const result = await asyncPost<BoundedPath>( '/rides/ride', { queryType, queryRequest, dbName } )
        data = result.data   
        path = data.path;

        console.log("Got data for municipality:", queryRequest, "\nLength:", path.length, '\nMeasurement:', name, '\nHasValue?:', hasValue );

        titleText = "No data for " + name
        footerText = "Chosen municipality was: " + queryRequest
    }
    
    
    if ( path === undefined || path.length === 0 )
    {
        popup( {
            icon: "warning",
            title: `${titleText}`,
            footer: `${footerText}`,
            toast: true
        } );

        return undefined;
    }
    return data;
}