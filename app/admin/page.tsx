import { Building2, CheckCircle, Users, Eye, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalRooms },
    { count: availableRooms },
    { count: occupiedRooms },
    { data: recentRooms },
  ] = await Promise.all([
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("available", true),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("available", false),
    supabase.from("rooms").select("id, title, price, property_type, location_name, available, created_at, room_images(image_url)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Rooms", value: totalRooms ?? 0, icon: Building2 },
    { label: "Available", value: availableRooms ?? 0, icon: CheckCircle },
    { label: "Occupied", value: occupiedRooms ?? 0, icon: Users },
    { label: "Total Views", value: 1204, icon: Eye },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary-text">Dashboard</h1>
        <p className="text-[13px] text-secondary-text mt-0.5">Overview of RoomUndo.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface p-4 rounded-lg border border-border-color">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                <stat.icon className="w-4 h-4 text-primary-text" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-primary-text mt-px">{typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-lg border border-border-color overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-color flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-primary-text">Recent Rooms</h2>
          <Link href="/admin/rooms" className="flex items-center gap-1 text-[12px] font-medium text-secondary-text hover:text-primary-text transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {(!recentRooms || recentRooms.length === 0) ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-secondary-text">No rooms added recently.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-color">
            {recentRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-3 px-5 py-3 hover:bg-accent-light/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                  {room.room_images?.[0]?.image_url ? (
                    <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-[10px] font-medium">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-primary-text truncate">{room.title}</p>
                  <p className="text-[11px] text-secondary-text">{room.location_name} · {room.property_type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-medium text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                  <span className={`text-[11px] ${room.available ? 'text-success' : 'text-secondary-text'}`}>
                    {room.available ? "Available" : "Occupied"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
