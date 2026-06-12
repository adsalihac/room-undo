import { createClient } from "@/utils/supabase/server";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
          <h1 className="text-3xl font-bold text-primary-text mb-1">Manage Rooms</h1>
          <p className="text-secondary-text text-sm">View, edit, and remove property listings.</p>
        </div>
        <Link 
          href="/admin/add-room" 
          className="bg-success text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-success/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border-color">
                <th className="py-4 px-6 font-semibold text-sm text-secondary-text">Property</th>
                <th className="py-4 px-6 font-semibold text-sm text-secondary-text">Location</th>
                <th className="py-4 px-6 font-semibold text-sm text-secondary-text">Price</th>
                <th className="py-4 px-6 font-semibold text-sm text-secondary-text">Status</th>
                <th className="py-4 px-6 font-semibold text-sm text-secondary-text text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!rooms || rooms.length === 0) ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-secondary-text">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl opacity-50">🏠</span>
                      </div>
                      <p className="text-base font-medium text-primary-text mb-1">No rooms listed yet</p>
                      <p className="text-sm">Get started by adding your first property.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-border-color hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden relative">
                          {/* We try to load the first image if it exists */}
                          {room.room_images?.[0]?.image_url ? (
                            <img src={room.room_images[0].image_url} alt={room.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-text/50">
                              <span className="text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-primary-text text-sm line-clamp-1">{room.title}</p>
                          <p className="text-xs text-secondary-text mt-0.5">{room.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <p className="text-sm text-primary-text">{room.location_name}</p>
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <p className="text-sm font-bold text-primary-text">₹{room.price.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-secondary-text mt-0.5">/ mo</p>
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        room.available 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}>
                        {room.available ? "Available" : "Occupied"}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-secondary-text hover:text-primary-text hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
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
