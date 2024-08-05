"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProtestLocation } from "@/types";

interface MapProps {
  protestLocations: ProtestLocation[];
  initialProtests: ProtestLocation[];
  bounds: [[number, number], [number, number]];
}

export default function Map({ protestLocations, initialProtests, bounds }: MapProps) {
  return (
    <MapContainer bounds={bounds} style={{ height: "80%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {[...initialProtests, ...protestLocations].map((protest) => (
        <Marker
          key={protest.id}
          position={[protest.latitude, protest.longitude]}
        >
          <Popup>{protest.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
