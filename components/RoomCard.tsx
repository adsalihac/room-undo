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
      className={`w-full text-left rounded-xl border bg-surface transition-all duration-150 ${
        isSelected
          ? "border-accent shadow-sm"
          : "border-border-color hover:border-border-color/80 hover:shadow-sm"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-semibold text-primary-text leading-snug truncate">
              {room.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-secondary-text" />
              <span className="text-[12px] text-secondary-text truncate">{room.location_name}</span>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-accent-light text-secondary-text">
            {room.property_type}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-primary-text tracking-tight">₹{room.price.toLocaleString("en-IN")}</span>
            <span className="text-[12px] text-secondary-text ml-1">/mo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${room.available ? "bg-success" : "bg-gray-300"}`} />
            <span className="text-[11px] font-medium text-secondary-text">
              {room.available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
