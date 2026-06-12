"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";

// We need a way to pass selected room state upwards or handle drawer
// For now we'll accept a prop onRoomSelect

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

// Custom Marker component
const createCustomIcon = (price: number, isSelected: boolean) => {
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`;
  
  const html = `
    <div class="relative transform transition-transform duration-200 ${isSelected ? 'scale-110 z-50' : 'hover:scale-110'}">
      <div class="px-3 py-1.5 bg-white text-primary-text font-bold text-sm rounded-full shadow-md border ${isSelected ? 'border-success' : 'border-border-color'} whitespace-nowrap">
        ${formattedPrice}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [60, 30],
    iconAnchor: [30, 15],
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

  // Center of Kerala approx
  const center: L.LatLngExpression = [10.8505, 76.2711];

  const handleRoomClick = (room: Room) => {
    setSelectedRoomId(room.id);
    onRoomSelect(room);
  };

  const handleMapClick = () => {
    setSelectedRoomId(null);
    // Ideally we also hide the drawer here, but let's assume the drawer handles its own close
  };

  return (
    <MapContainer 
      center={center} 
      zoom={8} 
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
