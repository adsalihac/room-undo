"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*, room_images(image_url)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
        return;
      }

      const mappedRooms: Room[] = (data || []).map((room: any) => ({
        id: room.id,
        title: room.title,
        description: room.description || "",
        price: room.price,
        deposit: room.deposit || 0,
        latitude: room.latitude,
        longitude: room.longitude,
        property_type: room.property_type,
        gender_preference: room.gender_preference || "Any",
        location_name: room.location_name,
        available: room.available,
        owner_name: room.owner_name || "",
        phone: room.phone || "",
        whatsapp: room.whatsapp || "",
        image_url: room.room_images?.[0]?.image_url || "",
        images: (room.room_images || []).map((img: any) => img.image_url),
        amenities: [],
        reviews: [],
      }));
      setRooms(mappedRooms);
      setLoading(false);
    };

    fetchRooms();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
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

      <div className="w-full h-full">
        <MapComponent
          rooms={rooms}
          onRoomSelect={(room) => setSelectedRoom(room)}
          center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
          zoom={userLocation ? 14 : undefined}
        />
      </div>

      <RoomDetailDrawer
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </main>
  );
}
