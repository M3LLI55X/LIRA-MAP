//Christian Wu - s194597
import { MapContainer, ScaleControl, TileLayer } from "react-leaflet";

import Zoom from "./Zoom";

import { useState } from "react";
import { Button } from "react-bootstrap";
import "../../css/map.css";
import { MAP_OPTIONS } from "./constants";

const MapWrapper = (props: any) => {
  const { children } = props;
  const { center, zoom, minZoom, maxZoom, scaleWidth } = MAP_OPTIONS;

  const [mapLayer, setMapLayer] = useState("OpenStreet");

  const handleMapLayerOpenStreet = () => setMapLayer("OpenStreet");
  const handleMapLayerCartoDB = () => setMapLayer("CartoDB");
  const handleMapLayerWikipedia = () => setMapLayer("Wikipedia");
  const handleMapLayerEsriWorld = () => setMapLayer("EsriWorld");
  const handleMapLayerEsriSatellite = () => setMapLayer("EsriSatellite");

  return (
    <>
      <MapContainer
        preferCanvas={true}
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        {mapLayer === "OpenStreet" ? (
          <TileLayer
            maxNativeZoom={maxZoom}
            maxZoom={maxZoom}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : null}
        {mapLayer === "CartoDB" ? (
          <TileLayer
            maxNativeZoom={maxZoom}
            maxZoom={maxZoom}
            attribution='&copy; <a href="https://carto.com/legal/">Carto Database</a> contributors'
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          />
        ) : null}
        {mapLayer === "Wikipedia" ? (
          <TileLayer
            maxNativeZoom={maxZoom}
            maxZoom={maxZoom}
            attribution='&copy; <a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikipedia</a> contributors'
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
          />
        ) : null}
        {mapLayer === "EsriWorld" ? (
          <TileLayer
            maxNativeZoom={maxZoom}
            maxZoom={maxZoom}
            attribution='&copy; <a href="https://doc.arcgis.com/en/arcgis-online/reference/display-copyrights.htm">Esri World</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          />
        ) : null}
        {mapLayer === "EsriSatellite" ? (
          <TileLayer
            maxNativeZoom={maxZoom}
            maxZoom={maxZoom}
            attribution='&copy; <a href="https://doc.arcgis.com/en/arcgis-online/reference/display-copyrights.htm">EsriSatellite</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/
            {z}/{y}/{x}"
          />
        ) : null}

        <Zoom />
        {/* <span class="material-icons-outlined">file_download</span> */}
        <ScaleControl
          imperial={false}
          position="bottomright"
          maxWidth={scaleWidth}
        />
        {children}
      </MapContainer>
      <div className="map-layer-bar">
        <Button className={`overlay-button ${mapLayer === 'OpenStreet' && 'active'}`} onClick={handleMapLayerOpenStreet}>Open street map</Button>
        <Button className={`overlay-button ${mapLayer === 'CartoDB' && 'active'}`} onClick={handleMapLayerCartoDB}>Carto Data base</Button>
        <Button className={`overlay-button ${mapLayer === 'Wikipedia' && 'active'}`} onClick={handleMapLayerWikipedia}>Wikipedia</Button>
        <Button className={`overlay-button ${mapLayer === 'EsriWorld' && 'active'}`} onClick={handleMapLayerEsriWorld}>Esri World</Button>
        <Button className={`overlay-button ${mapLayer === 'EsriSatellite' && 'active'}`} onClick={handleMapLayerEsriSatellite}>Esri Sattelite</Button>
      </div>
    </>
  );
};

export default MapWrapper;
