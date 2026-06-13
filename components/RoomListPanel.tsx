"use client";

import { useState } from "react";
import { Search, Plus, User } from "lucide-react";
import Link from "next/link";
import RoomCard from "./RoomCard";
import Logo from "./Logo";
import Footer from "./Footer";
import type { Room } from "./MapComponent";

interface RoomListPanelProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (room: Room) => void;
}

export default function RoomListPanel({ rooms, selectedRoomId, onRoomSelect }: RoomListPanelProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const propertyTypes = ["All", ...new Set(rooms.map((r) => r.property_type))];

  const filtered = rooms.filter((room) => {
    const matchSearch =
      !search ||
      room.title.toLowerCase().includes(search.toLowerCase()) ||
      room.location_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || room.property_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
        <Link href="/">
          <Logo size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/add-room"
            className="inline-flex items-center gap-1.5 px-3 h-[32px] text-[12px] font-medium text-white rounded-lg transition-colors hover:bg-accent-hover"
            style={{ backgroundColor: "var(--color-accent, #0F172A)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Room</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-[32px] h-[32px] text-secondary-text rounded-lg hover:bg-accent-light transition-colors"
            aria-label="Login"
          >
            <User className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-4 pt-3 pb-2 border-b border-border-color space-y-2.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="w-full pl-8 pr-3 h-[34px] rounded-lg border border-border-color bg-surface text-[13px] text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/30 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`shrink-0 px-2.5 h-[26px] rounded-md text-[11px] font-medium transition-colors ${
                filterType === type
                  ? "text-white"
                  : "text-secondary-text bg-surface border border-border-color hover:bg-accent-light"
              }`}
              style={filterType === type ? { backgroundColor: "var(--color-accent, #0F172A)" } : undefined}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-2 text-[11px] font-medium text-secondary-text border-b border-border-color/50">
        {filtered.length} {filtered.length === 1 ? "room" : "rooms"} found
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[13px] text-secondary-text">No rooms match your search.</p>
          </div>
        ) : (
          filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoomId === room.id}
              onClick={() => onRoomSelect(room)}
            />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
