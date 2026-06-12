"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import FilterPanel from "@/components/FilterPanel";
import RoomDetailDrawer from "@/components/RoomDetailDrawer";
import type { Room } from "@/components/MapComponent";
import { createClient } from "@/utils/supabase/client";

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

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("rooms")
      .select("*, room_images(image_url), amenities(name), reviews(username, rating, comment)")
      .eq("available", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching rooms:", error);
          return;
        }
        const mappedRooms: Room[] = (data || []).map((room: any) => ({
          id: room.id,
          title: room.title,
          description: room.description,
          price: room.price,
          deposit: room.deposit,
          latitude: room.latitude,
          longitude: room.longitude,
          property_type: room.property_type,
          gender_preference: room.gender_preference,
          location_name: room.location_name,
          available: room.available,
          owner_name: room.owner_name,
          phone: room.phone,
          whatsapp: room.whatsapp,
          image_url: room.room_images?.[0]?.image_url || "",
          amenities: room.amenities?.map((a: any) => a.name) || [],
          reviews: room.reviews || [],
        }));
        setRooms(mappedRooms);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="relative w-full h-full overflow-hidden">
        <TopNav />
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="text-secondary-text font-medium">Loading rooms...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-full overflow-hidden">
      <TopNav />
      <FilterPanel />
      
      <div className="w-full h-full">
        <MapComponent 
          rooms={rooms} 
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
