"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  latitude: number;
  longitude: number;
  property_type: string;
  gender_preference: string;
  location_name: string;
  available: boolean;
  owner_name: string;
  phone: string;
  whatsapp: string;
  image_url: string;
  images: string[];
  amenities: string[];
  reviews: { username: string; rating: number; comment: string }[];
}

interface MapComponentProps {
  rooms: Room[];
  onRoomSelect: (room: Room) => void;
  center?: L.LatLngExpression;
  zoom?: number;
}

const createCustomIcon = (room: Room, isSelected: boolean) => {
  const formattedPrice = `₹${room.price.toLocaleString("en-IN")}`;

  const html = `
    <div style="transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1); transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};">
      <div style="
        background: ${isSelected ? '#0F172A' : 'white'};
        border-radius: 12px;
        padding: 8px 16px;
        box-shadow: ${isSelected ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.08)'};
        border: 2px solid ${isSelected ? '#0F172A' : '#E2E8F0'};
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
        cursor: pointer;
      ">
        <div style="font-weight: 800; font-size: 13px; color: ${isSelected ? 'white' : '#0F172A'}; white-space: nowrap; letter-spacing: -0.02em;">
          ${formattedPrice}
        </div>
        <div style="font-weight: 600; font-size: 10px; color: ${isSelected ? 'rgba(255,255,255,0.7)' : '#64748B'}; white-space: nowrap; margin-top: 2px; letter-spacing: 0.02em;">
          ${room.property_type}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [100, 56],
    iconAnchor: [50, 28],
  });
};

function MapEventHandler({ onMapClick }: { onMapClick: () => void }) {
  const map = useMap();
  useEffect(() => {
    map.on("click", onMapClick);
    return () => {
      map.off("click", onMapClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default function MapComponent({ rooms, onRoomSelect, center: propCenter, zoom: propZoom }: MapComponentProps) {
  const center: L.LatLngExpression = propCenter || [10.8505, 76.2711];
  const zoom = propZoom ?? 8;

  const handleRoomClick = (room: Room) => {
    onRoomSelect(room);
  };

  const handleMapClick = () => {};

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      />
      <MapEventHandler onMapClick={handleMapClick} />

      {rooms.map((room) => (
        <Marker
          key={room.id}
          position={[room.latitude, room.longitude]}
          icon={createCustomIcon(room, false)}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              handleRoomClick(room);
            }
          }}
        />
      ))}
    </MapContainer>
  );
}
