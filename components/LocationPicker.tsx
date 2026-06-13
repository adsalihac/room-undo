"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface LocationPickerProps {
  center: { lat: number; lng: number };
  onCenterChange: (center: { lat: number; lng: number }) => void;
}

function CenterUpdater({ onCenterChange }: { onCenterChange: (c: { lat: number; lng: number }) => void }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const c = map.getCenter();
      onCenterChange({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

export default function LocationPicker({ center, onCenterChange }: LocationPickerProps) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      zoomControl={false}
      className="w-full h-full"
      scrollWheelZoom={true}
      dragging={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CenterUpdater onCenterChange={onCenterChange} />
    </MapContainer>
  );
}
