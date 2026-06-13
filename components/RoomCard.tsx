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
      className={`w-full text-left rounded-2xl border-2 bg-surface transition-all duration-200 hover:-translate-y-1 ${
        isSelected
          ? "border-accent shadow-lg shadow-accent/20"
          : "border-transparent shadow-md hover:shadow-lg hover:border-gray-100"
      }`}
    >
      <div className="p-5 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-extrabold text-primary-text leading-tight truncate">
              {room.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 shrink-0 text-secondary-text" />
              <span className="text-[13px] text-secondary-text truncate font-medium">{room.location_name}</span>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-accent-light text-accent border border-accent/20">
            {room.property_type}
          </span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-border-color/50">
          <div>
            <span className="text-2xl font-extrabold text-primary-text tracking-tight">
              ₹{room.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[13px] text-secondary-text ml-1 font-bold">/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${room.available ? "bg-accent" : "bg-gray-300"}`} />
            <span className={`text-[12px] font-extrabold ${room.available ? "text-accent" : "text-secondary-text"}`}>
              {room.available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
