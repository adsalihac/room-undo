import { Building2, Users, Eye, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch metrics in parallel
  const [
    { count: totalRooms },
    { count: availableRooms },
    { count: occupiedRooms },
  ] = await Promise.all([
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("available", true),
    supabase.from("rooms").select("*", { count: "exact", head: true }).eq("available", false),
  ]);

  const stats = [
    { label: "Total Rooms", value: totalRooms?.toString() || "0", icon: Building2, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Available Rooms", value: availableRooms?.toString() || "0", icon: CheckCircle, color: "text-success", bg: "bg-success/20" },
    { label: "Occupied Rooms", value: occupiedRooms?.toString() || "0", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Total Views", value: "1,204", icon: Eye, color: "text-purple-600", bg: "bg-purple-100" }, // Mocked for now
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-text mb-2">Dashboard</h1>
        <p className="text-secondary-text">Welcome back, Admin. Here's an overview of RoomUndo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border-color flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-text">{stat.label}</p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-6 border-b border-border-color flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-text">Recent Rooms</h2>
          <button className="text-sm font-medium text-success hover:text-success/80">View All</button>
        </div>
        <div className="p-6 text-center text-secondary-text py-12">
          No rooms have been added recently.
        </div>
      </div>
    </div>
  );
}
