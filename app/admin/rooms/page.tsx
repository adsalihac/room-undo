import { createClient } from "@/utils/supabase/server";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminRoomsPage() {
  const supabase = await createClient();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*, room_images(image_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-text mb-1">Rooms</h1>
          <p className="text-[15px] text-secondary-text">View and manage property listings.</p>
        </div>
        <Link 
          href="/admin/add-room" 
          className="flex items-center gap-2 h-[40px] px-5 rounded-xl text-[14px] font-medium text-white transition-colors"
          style={{ backgroundColor: '#0F172A' }}
        >
          <Plus className="w-4 h-4" />
          Add Room
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="py-3.5 px-5 font-semibold text-[12px] text-secondary-text uppercase tracking-[0.12em]">Property</th>
                <th className="py-3.5 px-5 font-semibold text-[12px] text-secondary-text uppercase tracking-[0.12em]">Location</th>
                <th className="py-3.5 px-5 font-semibold text-[12px] text-secondary-text uppercase tracking-[0.12em]">Price</th>
                <th className="py-3.5 px-5 font-semibold text-[12px] text-secondary-text uppercase tracking-[0.12em]">Status</th>
                <th className="py-3.5 px-5 font-semibold text-[12px] text-secondary-text uppercase tracking-[0.12em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!rooms || rooms.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-16 px-5 text-center">
                    <p className="text-[15px] text-secondary-text">No rooms listed yet.</p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-color hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                          {room.room_images?.[0]?.image_url ? (
                            <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-text/40 text-[11px] font-medium">
                              —
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-primary-text">{room.title}</p>
                          <p className="text-[13px] text-secondary-text">{room.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 align-middle">
                      <p className="text-[14px] text-primary-text">{room.location_name}</p>
                    </td>
                    <td className="py-3.5 px-5 align-middle">
                      <p className="text-[14px] font-medium text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                      <p className="text-[12px] text-secondary-text">/ month</p>
                    </td>
                    <td className="py-3.5 px-5 align-middle">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[12px] font-medium border ${
                        room.available 
                          ? "bg-gray-50 text-primary-text border-border-color" 
                          : "bg-gray-50 text-secondary-text border-border-color"
                      }`}>
                        {room.available ? "Available" : "Occupied"}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/edit-room/${room.id}`} className="p-2 text-secondary-text hover:text-primary-text hover:bg-gray-100 rounded-lg transition-colors inline-flex" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
