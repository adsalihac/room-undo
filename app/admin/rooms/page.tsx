import { createClient } from "@/utils/supabase/server";
import { Plus, Edit2 } from "lucide-react";
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
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary-text">Rooms</h1>
          <p className="text-[13px] text-secondary-text mt-0.5">Manage property listings.</p>
        </div>
        <Link
          href="/admin/add-room"
          className="inline-flex items-center gap-1.5 h-[36px] px-4 rounded-lg text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          style={{ backgroundColor: '#0F172A' }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Room
        </Link>
      </div>

      <div className="bg-surface rounded-lg border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-color">
                <th className="py-3 px-4 font-medium text-[11px] text-secondary-text uppercase tracking-wider">Property</th>
                <th className="py-3 px-4 font-medium text-[11px] text-secondary-text uppercase tracking-wider">Location</th>
                <th className="py-3 px-4 font-medium text-[11px] text-secondary-text uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 font-medium text-[11px] text-secondary-text uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-medium text-[11px] text-secondary-text uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!rooms || rooms.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <p className="text-[13px] text-secondary-text">No rooms listed yet.</p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-color hover:bg-accent-light/30 transition-colors">
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          {room.room_images?.[0]?.image_url ? (
                            <img src={room.room_images[0].image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-[10px] font-medium">—</div>
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-primary-text">{room.title}</p>
                          <p className="text-[11px] text-secondary-text">{room.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <p className="text-[13px] text-primary-text">{room.location_name}</p>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <p className="text-[13px] font-medium text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        room.available
                          ? "text-success bg-success-bg border-success/20"
                          : "text-secondary-text bg-gray-50 border-border-color"
                      }`}>
                        {room.available ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-middle text-right">
                      <Link
                        href={`/admin/edit-room/${room.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-secondary-text hover:text-primary-text hover:bg-accent-light rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Link>
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
