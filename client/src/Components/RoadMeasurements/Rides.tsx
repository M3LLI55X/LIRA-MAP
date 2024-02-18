// Christian Wu - s194597
// In smaller sections: László Barak - s222899, Peter Frederiksen - s204484 and Mathias Jensen - s204480
import { FC, useEffect, useState } from "react";

import { GraphProvider } from "../../context/GraphContext";
import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { useMetasCtx } from "../../context/MetasContext";

import { MeasMetaPath, PointData } from "../../models/path";
import { ActiveMeasProperties } from "../../models/properties";


import { GraphData, GraphPoint } from "../../assets/graph/types";

import { getRide } from "../../queries/rides";

import usePopup from "../createPopup";
import Graph from "../Graph/Graph";
import RidesMap from "./RidesMap";

import { chosenMunicipality } from "./OptionsSelector";

const Rides: FC = () => {

    const { selectedMetas } = useMetasCtx()

    let { selectedMeasurements } = useMeasurementsCtx()

    const [paths, setPaths] = useState<MeasMetaPath>({})

    const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);

    const popup = usePopup()

    const [currentTripId , setCurrentTripId] = useState<string>('hi');

    const setShownGraphMeasurementGraph = (m: string) => {

        if (m !== null) {
            selectedMeasurements.forEach(e => {
                if (m === e.name) {
                    e.isShownOnGraph = true;
                }
                else {
                    e.isShownOnGraph = false;
                }
            })
        }
    }

    useEffect(() => {

        const toggleLoadingSpinner = () => setShowLoadingSpinner(prev => !prev)

        const updatePaths = async () => {
            if (showLoadingSpinner) {
                toggleLoadingSpinner();
            }
            toggleLoadingSpinner();
            const temp = {} as MeasMetaPath;
            for (let meas of selectedMeasurements) {
                const { name } = meas
                temp[name] = {}
                //László Barak - s222899 - start
                for (let meta of selectedMetas) {
                    const { TaskId } = meta;
                    const { TripId: tripId } = meta;
                    setCurrentTripId(tripId)
                }
                //end
                // Christian Wu - s194597, Peter Frederiksen - s204484 and Mathias Jensen - s204480
                if (selectedMetas.length > 1 || chosenMunicipality === "") {
                    for (let meta of selectedMetas) {

                        const { TaskId } = meta;

                        if (Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId))
                            temp[name][TaskId] = paths[name][TaskId]
                        else {
                            const bp = await getRide(meas, meta, popup, 'FK_Trip')

                            if (bp !== undefined)
                                temp[name][TaskId] = bp;
                        }
                    }
                } else if (selectedMetas.length == 1) {
                    const { TaskId } = selectedMetas[0];
                    if (Object.hasOwn(paths, name) && Object.hasOwn(paths[name], TaskId))
                        temp[name][TaskId] = paths[name][TaskId]
                    else {
                        const bp = await getRide(meas, selectedMetas, popup, chosenMunicipality)

                        if (bp !== undefined)
                            temp[name][TaskId] = bp;
                    }
                }
                // end
            }
            toggleLoadingSpinner();
            return temp;
        }

        updatePaths().then(setPaths)

    }, [selectedMetas, selectedMeasurements])

    return (
        <GraphProvider>
            <div className="map-container">
                <RidesMap
                    paths={paths}
                    selectedMetas={selectedMetas}
                    selectedMeasurements={selectedMeasurements} />

                {selectedMeasurements.map(({ hasValue, name, palette }: ActiveMeasProperties, i: number) => hasValue &&
                    <div>
                        <Graph
                            key={`graph-${i}`}
                            labelX="Time (h:m:s)"
                            labelY={name}
                            showLoadingSpinner={showLoadingSpinner}
                            absolute={true}
                            time={true}
                            palette={palette}
                            queryRequest={selectedMetas.length > 1 || chosenMunicipality === "" ? currentTripId : chosenMunicipality}
                            queryType={selectedMetas.length > 1 || chosenMunicipality === "" ? 'FK_Trip' : 'Municipality'}
                            plots={Object.entries(paths[name] || {}
                            )
                                .map(([TaskId, bp], j) => {
                                    const { path, bounds } = bp;
                                    const x = (p: PointData) => new Date(p.metadata.timestamp).getTime()
                                    const data: GraphData = path
                                        .map(p => [x(p), p.value || 0] as GraphPoint)
                                        .sort(([x1, y1], [x2, y2]) => (x1 < x2) ? -1 : (x1 === x2) ? 0 : 1)
                                    return { data, bounds, label: 'r-' + TaskId, j }
                                })
                            }
                        />
                    </div>
                )}
            </div>
            <div className="map-container-footer-wrapper">
                <div className="map-container-footer">
                    <div className="map-container-footer-img"></div>
                    <div />
                </div>
            </div>
        </GraphProvider >
    )
}

export default Rides;
