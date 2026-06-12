"use client";

import { useEffect, useState } from "react";
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
    <div class="transition-all duration-200 ${isSelected ? 'scale-110 z-[1000]' : ''}" style="filter: ${isSelected ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))'};">
      <div style="
        background: white;
        border-radius: 10px;
        padding: 8px 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: ${isSelected ? '1.5px solid #111827' : '1px solid #E5E7EB'};
        transition: all 200ms ease;
        font-family: var(--font-geist-sans), Inter, system-ui, sans-serif;
      ">
        <div style="font-weight: 700; font-size: 13px; color: #111827; white-space: nowrap; letter-spacing: -0.01em;">
          ${formattedPrice}
        </div>
        <div style="font-weight: 500; font-size: 11px; color: #6B7280; white-space: nowrap; margin-top: 1px;">
          ${room.property_type}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [100, 54],
    iconAnchor: [50, 27],
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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const center: L.LatLngExpression = propCenter || [10.8505, 76.2711];
  const zoom = propZoom ?? 8;

  const handleRoomClick = (room: Room) => {
    setSelectedRoomId(room.id);
    onRoomSelect(room);
  };

  const handleMapClick = () => {
    setSelectedRoomId(null);
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      zoomControl={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapEventHandler onMapClick={handleMapClick} />
      
      {rooms.map((room) => (
        <Marker
          key={room.id}
          position={[room.latitude, room.longitude]}
          icon={createCustomIcon(room, selectedRoomId === room.id)}
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
