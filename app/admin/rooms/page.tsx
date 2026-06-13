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
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Rooms</h1>
          <p className="text-[14px] text-secondary-text mt-0.5">Manage your property listings.</p>
        </div>
        <Link
          href="/admin/add-room"
          className="inline-flex items-center gap-1.5 h-[40px] px-5 rounded-xl text-[13px] font-bold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: "#0F172A" }}
        >
          <Plus className="w-4 h-4" />
          Add Room
        </Link>
      </div>

      <div className="bg-surface rounded-xl border border-border-color/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-color/70 bg-accent-light/50">
                <th className="py-3.5 px-5 font-bold text-[11px] text-secondary-text uppercase tracking-wider">Property</th>
                <th className="py-3.5 px-5 font-bold text-[11px] text-secondary-text uppercase tracking-wider">Location</th>
                <th className="py-3.5 px-5 font-bold text-[11px] text-secondary-text uppercase tracking-wider">Price</th>
                <th className="py-3.5 px-5 font-bold text-[11px] text-secondary-text uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 font-bold text-[11px] text-secondary-text uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!rooms || rooms.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-16 px-5 text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-5 h-5 text-secondary-text" />
                    </div>
                    <p className="text-[14px] font-semibold text-primary-text mb-1">No rooms listed yet</p>
                    <p className="text-[13px] text-secondary-text">Click &quot;Add Room&quot; to create your first listing.</p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-color/30 hover:bg-accent-light/30 transition-colors">
                    <td className="py-4 px-5 align-middle">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-accent-light shrink-0 overflow-hidden border border-border-color/50">
                          {room.room_images?.[0]?.image_url ? (
                            <img src={room.room_images[0].image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-xs font-bold">—</div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-primary-text">{room.title}</p>
                          <p className="text-[12px] text-secondary-text">{room.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[14px] text-primary-text">{room.location_name}</p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[14px] font-bold text-primary-text">₹{room.price.toLocaleString("en-IN")}<span className="text-[12px] text-secondary-text font-normal">/mo</span></p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        room.available
                          ? "text-success bg-success-bg border-success/20"
                          : "text-secondary-text bg-accent-light border-border-color/50"
                      }`}>
                        {room.available ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td className="py-4 px-5 align-middle text-right">
                      <Link
                        href={`/admin/edit-room/${room.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold text-secondary-text hover:text-primary-text hover:bg-accent-light rounded-xl transition-all"
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
