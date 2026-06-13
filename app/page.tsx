"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import RoomDetailDrawer from "@/components/RoomDetailDrawer";
import SplitPanel from "@/components/SplitPanel";
import RoomListPanel from "@/components/RoomListPanel";
import type { Room } from "@/components/MapComponent";
import { createClient } from "@/utils/supabase/client";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[4px] border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-[15px] font-extrabold text-secondary-text">Loading map...</p>
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
        reviews: room.reviews?.map((r: any) => ({
          username: r.username || r.user_name || "Anonymous",
          rating: r.rating || 0,
          comment: r.comment || "",
          date: r.date || r.created_at || new Date().toISOString(),
          verified: r.verified ?? true,
          helpful: r.helpful ?? 0,
        })) || [],
        featured: room.featured ?? false,
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

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  if (loading) {
    return (
      <main className="relative w-full h-full overflow-hidden bg-background">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[4px] border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-[15px] font-extrabold text-secondary-text">Loading rooms...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-full overflow-hidden bg-background">
      <SplitPanel
        orientation="horizontal"
        defaultRatio={0.65}
        first={
          <div className="w-full h-full">
            <MapComponent
              rooms={rooms}
              onRoomSelect={handleRoomSelect}
              center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
              zoom={userLocation ? 14 : undefined}
            />
          </div>
        }
        second={
          <div className="w-full h-full shadow-2xl relative z-10">
            <RoomListPanel
              rooms={rooms}
              selectedRoomId={selectedRoom?.id || null}
              onRoomSelect={handleRoomSelect}
              loading={loading}
            />
          </div>
        }
      />

      <RoomDetailDrawer
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </main>
  );
}
