"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import React from "react";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapType = "light" | "dark" | "osm" | "voyager" | "satelight"| "voyager_labels" ;

interface Props {
  currentTheme?: MapType;
}

delete L.Icon.Default.imagePath;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapView = ({ currentTheme = "light" }: Props) => {
  const position: LatLngExpression = [51.51, -0.12];

  const themes = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    voyager:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satelight:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
     voyager_labels:"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
    
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      maxZoom={18}
      style={{ height: "100%" }}
    >
      <TileLayer
        url={themes[currentTheme]}
       

        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      {/* <MarkerClusterGroup>
        <Marker position={[49.8397, 24.0297]} />
        <Marker position={[52.2297, 21.0122]} />
        <Marker position={[51.5074, -0.0901]} />
      </MarkerClusterGroup> */}
    </MapContainer>
  );
};

export default MapView;


// const MapView = dynamic(() => import("@/components/ui/elements/MapView"), {
//   ssr: false,
// });