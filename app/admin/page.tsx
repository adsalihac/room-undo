import { Building2, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalRooms },
    { count: availableRooms },
    { data: recentRooms },
  ] = await Promise.all([
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("available", true),
    supabase.from("rooms").select("id, title, price, property_type, location_name, available, created_at, room_images(image_url)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Rooms", value: totalRooms ?? 0, icon: Building2, change: "+12%", color: "#FF385C" },
    { label: "Available", value: availableRooms ?? 0, icon: CheckCircle, change: "+5%", color: "#00A699" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-extrabold text-primary-text">Dashboard</h1>
          <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold border-2" style={{ color: "#FF385C", borderColor: "#FF385C", backgroundColor: "#FFF2F4" }}>
            Live
          </span>
        </div>
        <p className="text-[14px] text-secondary-text font-bold mt-0.5">Overview of RoomUndo property listings.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <span className="text-[12px] font-extrabold flex items-center gap-0.5" style={{ color: stat.color }}>
                <TrendingUp className="w-3.5 h-3.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-extrabold text-primary-text mt-1">{typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl border-2 border-border-color/50 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-border-color/50 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-primary-text">Recent Rooms</h2>
          <Link href="/admin/rooms" className="flex items-center gap-1 text-[13px] font-extrabold transition-all hover:-translate-y-0.5" style={{ color: "#FF385C" }}>
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {(!recentRooms || recentRooms.length === 0) ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Building2 className="w-6 h-6" style={{ color: "#FF385C" }} />
            </div>
            <p className="text-[15px] font-extrabold text-primary-text mb-1">No rooms yet</p>
            <p className="text-[14px] font-bold text-secondary-text">Add your first room to get started.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-border-color/40">
            {recentRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-4 px-6 py-4 hover:bg-accent-light/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-accent-light shrink-0 overflow-hidden border-2 border-border-color/50 shadow-sm">
                  {room.room_images?.[0]?.image_url ? (
                    <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-xs font-extrabold">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-extrabold text-primary-text truncate">{room.title}</p>
                  <p className="text-[13px] font-bold text-secondary-text">{room.location_name} · {room.property_type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[15px] font-extrabold text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border-2 ${
                    room.available ? "border-accent/30" : "border-border-color"
                  }`} style={{
                    color: room.available ? "#00A699" : "#717171",
                    backgroundColor: room.available ? "#E6F7E6" : "#F7F7F7"
                  }}>
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
