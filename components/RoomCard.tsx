"use client";

import { MapPin } from "lucide-react";
import type { Room } from "./MapComponent";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}

export default function RoomCard({ room, isSelected, onClick }: RoomCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 bg-surface transition-all duration-200 hover:-translate-y-0.5 ${
        isSelected
          ? "border-accent shadow-lg shadow-accent/10"
          : "border-transparent shadow-sm hover:shadow-md hover:border-border-color"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-primary-text leading-snug truncate">
              {room.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 shrink-0 text-secondary-text" />
              <span className="text-[12px] text-secondary-text truncate">{room.location_name}</span>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent-light text-secondary-text border border-border-color/50">
            {room.property_type}
          </span>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-border-color/50">
          <div>
            <span className="text-2xl font-extrabold text-primary-text tracking-tight">
              ₹{room.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[12px] text-secondary-text ml-1 font-medium">/mo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${room.available ? "bg-success" : "bg-gray-300"}`} />
            <span className={`text-[11px] font-semibold ${room.available ? "text-success" : "text-secondary-text"}`}>
              {room.available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
