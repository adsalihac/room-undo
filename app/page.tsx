"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import FilterPanel from "@/components/FilterPanel";
import RoomDetailDrawer from "@/components/RoomDetailDrawer";
import type { Room } from "@/components/MapComponent";
import { createClient } from "@/utils/supabase/client";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary-text/20 border-t-primary-text rounded-full animate-spin" />
        <div className="text-[14px] text-secondary-text font-medium">Loading map...</div>
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
      <main className="relative w-full h-full overflow-hidden bg-background">
        <TopNav />
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary-text/20 border-t-primary-text rounded-full animate-spin" />
            <div className="text-[14px] text-secondary-text font-medium">Loading rooms...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-full overflow-hidden bg-background">
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
