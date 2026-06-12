"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TopNav from "@/components/TopNav";
import FilterPanel from "@/components/FilterPanel";
import RoomDetailDrawer from "@/components/RoomDetailDrawer";
import type { Room } from "@/components/MapComponent";

// Dynamically import MapComponent with ssr disabled to prevent leaflet window errors
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="text-secondary-text font-medium">Loading Map...</div>
      </div>
    </div>
  ),
});

// Dummy Data
const DUMMY_ROOMS: Room[] = [
  {
    id: "1",
    title: "Premium PG Near Technopark",
    price: 6500,
    latitude: 10.5505,
    longitude: 76.2711,
    property_type: "PG",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    title: "1BHK Apartment Kazhakkoottam",
    price: 12000,
    latitude: 10.8605,
    longitude: 76.2811,
    property_type: "Apartment",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    title: "Shared Room for Boys",
    price: 4500,
    latitude: 10.8405,
    longitude: 76.2611,
    property_type: "Shared Room",
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    title: "Luxury Hostel Kakkanad",
    price: 8000,
    latitude: 10.0159,
    longitude: 76.3419,
    property_type: "Hostel",
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80"
  }
];

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <main className="relative w-full h-full overflow-hidden">
      <TopNav />
      <FilterPanel />
      
      <div className="w-full h-full">
        <MapComponent 
          rooms={DUMMY_ROOMS} 
          onRoomSelect={(room) => setSelectedRoom(room)} 
        />
      </div>

      <RoomDetailDrawer 
        room={selectedRoom} 
        onClose={() => setSelectedRoom(null)} 
      />
    </main>
  );
}
