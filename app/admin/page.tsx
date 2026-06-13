import { Building2, CheckCircle, Users, Eye, ArrowRight, TrendingUp } from "lucide-react";
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
    { label: "Total Rooms", value: totalRooms ?? 0, icon: Building2, change: "+12%", color: "bg-accent" },
    { label: "Available", value: availableRooms ?? 0, icon: CheckCircle, change: "+5%", color: "bg-success" },
    { label: "Occupied", value: occupiedRooms ?? 0, icon: Users, change: "+8%", color: "bg-accent-warm" },
    { label: "Total Views", value: 1204, icon: Eye, change: "+32%", color: "bg-accent" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-primary-text">Dashboard</h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20">
            Live
          </span>
        </div>
        <p className="text-[14px] text-secondary-text">Overview of RoomUndo property listings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface p-5 rounded-xl border border-border-color/70 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center shrink-0`}
                style={{ backgroundColor: stat.color === "bg-accent" ? "#0F172A" : stat.color === "bg-success" ? "#059669" : "#D97706", opacity: 0.1 }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color === "bg-accent" ? "#0F172A" : stat.color === "bg-success" ? "#059669" : "#D97706" }} />
              </div>
              <span className="text-[11px] font-bold text-success flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-extrabold text-primary-text mt-1">{typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border-color/70 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-color/70 flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-primary-text">Recent Rooms</h2>
          <Link href="/admin/rooms" className="flex items-center gap-1 text-[12px] font-bold text-secondary-text hover:text-primary-text transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {(!recentRooms || recentRooms.length === 0) ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-5 h-5 text-secondary-text" />
            </div>
            <p className="text-[14px] font-semibold text-primary-text mb-1">No rooms yet</p>
            <p className="text-[13px] text-secondary-text">Add your first room to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-color/50">
            {recentRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-4 px-6 py-4 hover:bg-accent-light/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-accent-light shrink-0 overflow-hidden border border-border-color/50">
                  {room.room_images?.[0]?.image_url ? (
                    <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-xs font-bold">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-primary-text truncate">{room.title}</p>
                  <p className="text-[12px] text-secondary-text">{room.location_name} · {room.property_type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-bold text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    room.available ? "text-success bg-success-bg" : "text-secondary-text bg-accent-light"
                  }`}>
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
