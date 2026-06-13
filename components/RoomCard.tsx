"use client";

import { MapPin } from "lucide-react";
import type { Room } from "./MapComponent";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  "Shared Room": "from-blue-500 to-blue-600",
  "Private Room": "from-violet-500 to-violet-600",
  "PG": "from-emerald-500 to-emerald-600",
  "Hostel": "from-amber-500 to-amber-600",
  "Apartment": "from-rose-500 to-rose-600",
};

const typeBadgeColors: Record<string, string> = {
  "Shared Room": "border-blue-500/30 bg-blue-50/95 text-blue-700",
  "Private Room": "border-violet-500/30 bg-violet-50/95 text-violet-700",
  "PG": "border-emerald-500/30 bg-emerald-50/95 text-emerald-700",
  "Hostel": "border-amber-500/30 bg-amber-50/95 text-amber-700",
  "Apartment": "border-rose-500/30 bg-rose-50/95 text-rose-700",
};

export default function RoomCard({ room, isSelected, onClick }: RoomCardProps) {
  const borderColor = room.available ? "border-l-emerald-500" : "border-l-gray-300";

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-border-color border-l-4 ${borderColor} bg-surface cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden ${
        isSelected ? "shadow-md ring-1 ring-primary-text/10" : "shadow-sm"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-semibold text-primary-text leading-snug truncate">
              {room.title}
            </h3>
            <div className="flex items-center gap-1 text-secondary-text mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-[12px] truncate">{room.location_name}</span>
            </div>
          </div>
          <div
            className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${typeBadgeColors[room.property_type] || "border-border-color bg-gray-50 text-secondary-text"}`}
          >
            {room.property_type}
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-bold text-primary-text tracking-tight">
                ₹{room.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[12px] text-secondary-text">/mo</span>
            </div>
            <p className="text-[12px] text-secondary-text mt-0.5">
              Deposit: ₹{room.deposit.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${room.available ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
            <span className="text-[11px] font-medium text-secondary-text">
              {room.available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
