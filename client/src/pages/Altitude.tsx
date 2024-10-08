import { useEffect, useState } from "react";

import Panel from "../Components/Altitude/Panel";
import MapWrapper from "../Components/Map/MapWrapper";
import DistHotline from "../Components/Map/Renderers/DistHotline";
import Heatmap from "../Components/Map/Renderers/Heatmap";

import { Node, WaysConditions } from "../models/path";

//Christian Wu - s194597
import { getAltitudes } from "../queries/altitude";

import { HEATMAP_OPTIONS, RENDERER_OPTIONS } from "../Components/Map/constants";
import "../css/altitude.css";

const Altitude = () => {

    const [altitudes, setAltitudes] = useState<WaysConditions>();
    const [showHotline, setShowHotline] = useState<boolean>(true);
    const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
    const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(true);

    useEffect(() => {
        getAltitudes((data: WaysConditions) => {
            setAltitudes(data)
            toggleLoadingSpinner();
        })

    }, [])

    const toggleShowHotline = () => setShowHotline(prev => !prev)
    const toggleShowHeatmap = () => setShowHeatmap(prev => !prev)
    const toggleLoadingSpinner = () => setShowLoadingSpinner(prev => !prev)

    return (
        <div className="altitude-wrapper">
            <MapWrapper>
                <Panel
                    showLoadingSpinner={showLoadingSpinner}
                    showHotline={showHotline}
                    showHeatmap={showHeatmap}
                    toggleShowHotline={toggleShowHotline}
                    toggleShowHeatmap={toggleShowHeatmap} />
                {showHotline && altitudes
                    ? <DistHotline
                        way_ids={altitudes.way_ids}
                        geometry={altitudes.geometry}
                        conditions={altitudes.conditions}
                        options={{ min: 0, max: 140 }} />
                    : null
                }
                {showHeatmap && altitudes
                    ? <Heatmap
                        data={altitudes.geometry.flat()}
                        getLat={(t: Node) => t.lat}
                        getLng={(t: Node) => t.lng}
                        getVal={(t: Node) => 2}
                        options={{
                            ...RENDERER_OPTIONS, // temporary fix
                            max: 10,
                            width: 20,
                            palette: HEATMAP_OPTIONS.palette
                        }} />
                    : null}
            </MapWrapper>
        </div>
    );
}

export default Altitude;