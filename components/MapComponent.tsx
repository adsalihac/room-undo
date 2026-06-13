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
    <div style="transition: all 200ms ease; transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};">
      <div style="
        background: ${isSelected ? '#0F172A' : 'white'};
        border-radius: 8px;
        padding: 6px 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid ${isSelected ? '#0F172A' : '#E5E7EB'};
        transition: all 200ms ease;
        font-family: var(--font-geist-sans), system-ui, sans-serif;
      ">
        <div style="font-weight: 700; font-size: 12px; color: ${isSelected ? 'white' : '#111827'}; white-space: nowrap; letter-spacing: -0.01em;">
          ${formattedPrice}
        </div>
        <div style="font-weight: 500; font-size: 10px; color: ${isSelected ? 'rgba(255,255,255,0.7)' : '#6B7280'}; white-space: nowrap; margin-top: 1px;">
          ${room.property_type}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [100, 50],
    iconAnchor: [50, 25],
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
