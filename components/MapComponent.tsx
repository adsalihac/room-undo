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
  amenities: string[];
  reviews: { username: string; rating: number; comment: string }[];
}

interface MapComponentProps {
  rooms: Room[];
  onRoomSelect: (room: Room) => void;
}

const createCustomIcon = (price: number, isSelected: boolean) => {
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`;

  const html = `
    <div class="transition-all duration-200 ${isSelected ? 'scale-110 z-[1000]' : ''}" style="filter: ${isSelected ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))'};">
      <div style="
        background: white;
        border-radius: 999px;
        padding: 10px 16px;
        font-weight: 600;
        font-size: 14px;
        color: #111827;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: ${isSelected ? '1.5px solid #111827' : '1px solid #E5E7EB'};
        white-space: nowrap;
        transition: all 200ms ease;
        font-family: var(--font-geist-sans), Inter, system-ui, sans-serif;
      ">
        ${formattedPrice}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [120, 44],
    iconAnchor: [60, 22],
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

export default function MapComponent({ rooms, onRoomSelect }: MapComponentProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const center: L.LatLngExpression = [10.8505, 76.2711];

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
      zoom={8} 
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
          icon={createCustomIcon(room.price, selectedRoomId === room.id)}
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
