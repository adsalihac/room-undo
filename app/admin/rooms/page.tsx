import { createClient } from "@/utils/supabase/server";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteRoomButton from "./delete-room";

async function deleteRoom(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("rooms").delete().eq("id", id);
  redirect("/admin/rooms");
}

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
          <h1 className="text-2xl font-extrabold text-primary-text">Rooms</h1>
          <p className="text-[14px] text-secondary-text font-bold mt-0.5">Manage your property listings.</p>
        </div>
        <Link
          href="/admin/add-room"
          className="inline-flex items-center gap-1.5 h-[44px] px-7 rounded-full text-[14px] font-extrabold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          style={{ backgroundColor: "#FF385C" }}
        >
          <Plus className="w-4.5 h-4.5" />
          Add Room
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border-2 border-border-color/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-border-color/50" style={{ backgroundColor: "#F7F7F7" }}>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Property</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Location</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Price</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!rooms || rooms.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-16 px-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Plus className="w-6 h-6" style={{ color: "#FF385C" }} />
                    </div>
                    <p className="text-[15px] font-extrabold text-primary-text mb-1">No rooms listed yet</p>
                    <p className="text-[14px] font-bold text-secondary-text">Click &quot;Add Room&quot; to create your first listing.</p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-color/30 hover:bg-accent-light/20 transition-colors">
                    <td className="py-4 px-5 align-middle">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-accent-light shrink-0 overflow-hidden border-2 border-border-color/50 shadow-sm">
                          {room.room_images?.[0]?.image_url ? (
                            <img src={room.room_images[0].image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-text/30 text-xs font-extrabold">—</div>
                          )}
                        </div>
                        <div>
                          <p className="text-[15px] font-extrabold text-primary-text">{room.title}</p>
                          <p className="text-[13px] font-bold text-secondary-text">{room.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[14px] font-bold text-primary-text">{room.location_name}</p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[15px] font-extrabold text-primary-text">₹{room.price.toLocaleString("en-IN")}<span className="text-[13px] text-secondary-text font-bold">/mo</span></p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-extrabold border-2 ${
                        room.available ? "border-accent/30" : "border-border-color"
                      }`} style={{
                        color: room.available ? "#00A699" : "#717171",
                        backgroundColor: room.available ? "#E6F7E6" : "#F7F7F7"
                      }}>
                        {room.available ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td className="py-4 px-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/edit-room/${room.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-extrabold rounded-full border-2 transition-all hover:-translate-y-0.5"
                          style={{ borderColor: "#E5E5E5", color: "#2B2B2B" }}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>
                        <DeleteRoomButton id={room.id} deleteAction={deleteRoom} />
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
