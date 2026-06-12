import { Building2, Users, Eye, CheckCircle, ArrowRight } from "lucide-react";
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
    { label: "Total Rooms", value: totalRooms?.toString() || "0", icon: Building2 },
    { label: "Available", value: availableRooms?.toString() || "0", icon: CheckCircle },
    { label: "Occupied", value: occupiedRooms?.toString() || "0", icon: Users },
    { label: "Total Views", value: "1,204", icon: Eye },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-primary-text mb-1">Dashboard</h1>
        <p className="text-[15px] text-secondary-text">Overview of RoomUndo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface p-5 rounded-2xl border border-border-color">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-primary-text" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em]">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary-text mt-0.5">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-hidden">
        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-primary-text">Recent Rooms</h2>
          <Link href="/admin/rooms" className="flex items-center gap-1 text-[13px] font-medium text-primary-text hover:text-primary-text/70 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {(!recentRooms || recentRooms.length === 0) ? (
          <div className="p-10 text-center">
            <p className="text-[15px] text-secondary-text">No rooms added recently.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-color">
            {recentRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                  {room.room_images?.[0]?.image_url ? (
                    <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text/40 text-[11px] font-medium">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-primary-text truncate">{room.title}</p>
                  <p className="text-[12px] text-secondary-text">{room.location_name} · {room.property_type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-medium text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                  <p className={`text-[12px] ${room.available ? "text-secondary-text" : "text-secondary-text"}`}>
                    {room.available ? "Available" : "Occupied"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
