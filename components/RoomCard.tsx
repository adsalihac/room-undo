"use client";

import { MapPin, Heart } from "lucide-react";
import type { Room } from "./MapComponent";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
  savedRooms: string[];
  toggleSaved: (roomId: string) => void;
  comparisonMode?: boolean;
  compareSelected?: boolean;
  onCompareToggle?: (roomId: string) => void;
}

function getAgeLabel(dateStr: string): { label: string; color: string; bg: string } | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return { label: "New", color: "#00A699", bg: "#E8F5E9" };
  if (days < 7) return { label: `${days}d`, color: "#FF9600", bg: "#FFF4E0" };
  if (days < 30) return { label: `${Math.floor(days / 7)}w`, color: "#717171", bg: "#F7F7F7" };
  return null;
}

export default function RoomCard({ room, isSelected, onClick, savedRooms, toggleSaved, comparisonMode, compareSelected, onCompareToggle }: RoomCardProps) {
  const saved = savedRooms.includes(room.id);
  const ageBadge = getAgeLabel(room.created_at);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`w-full text-left rounded-2xl border-2 bg-surface transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
        isSelected
          ? "border-accent shadow-lg shadow-accent/20"
          : "border-transparent shadow-md hover:shadow-lg hover:border-gray-100"
      }`}
    >
      <div className="p-5 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-extrabold text-primary-text leading-tight truncate">
                  {room.title}
                </h3>
                {room.featured && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase"
                    style={{ backgroundColor: "#FFF2F4", color: "#FF385C", border: "1.5px solid rgba(255,56,92,0.25)" }}
                  >
                    Featured
                  </span>
                )}
                {ageBadge && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                    style={{ backgroundColor: ageBadge.bg, color: ageBadge.color }}
                  >
                    {ageBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 shrink-0 text-secondary-text" />
                <span className="text-[13px] text-secondary-text truncate font-medium">{room.location_name}</span>
              </div>
              {room.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {room.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-extrabold"
                      style={{ backgroundColor: "var(--color-badge-bg)", color: "var(--color-secondary-text)" }}
                    >
                      {tag}
                    </span>
                  ))}
                  {room.tags.length > 3 && (
                    <span className="text-[9px] font-bold text-secondary-text">+{room.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {comparisonMode && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all cursor-pointer ${
                    compareSelected
                      ? "bg-accent border-accent text-white"
                      : "border-border-color bg-white hover:border-accent"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!compareSelected}
                    onChange={() => onCompareToggle?.(room.id)}
                    className="sr-only"
                  />
                  {compareSelected && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(room.id);
                }}
                className="p-1.5 rounded-full transition-all hover:bg-red-50 active:scale-95"
                aria-label={saved ? "Remove from saved" : "Save room"}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-secondary-text hover:text-red-400"}`}
                />
              </button>
              <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-accent-light text-accent border border-accent/20">
                {room.property_type}
              </span>
            </div>
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
    </div>
  );
}
