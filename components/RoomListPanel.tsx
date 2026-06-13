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
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-color/70">
        <Link href="/">
          <Logo size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/add-room"
            className="inline-flex items-center gap-1.5 px-3.5 h-[34px] text-[12px] font-bold text-white rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ backgroundColor: "#0F172A" }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Room</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-[34px] h-[34px] text-secondary-text rounded-lg hover:bg-accent-light hover:text-primary-text transition-colors border border-border-color/50"
            aria-label="Login"
          >
            <User className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-5 pt-4 pb-3 border-b border-border-color/70 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="w-full pl-9 pr-3 h-[38px] rounded-xl border border-border-color bg-background text-[13px] text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/5 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`shrink-0 px-3 h-[30px] rounded-lg text-[11px] font-bold transition-all ${
                filterType === type
                  ? "text-white shadow-sm"
                  : "text-secondary-text bg-background border border-border-color hover:border-border-color hover:bg-accent-light"
              }`}
              style={filterType === type ? { backgroundColor: "#0F172A" } : undefined}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-border-color/30">
        <p className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
          {filtered.length} {filtered.length === 1 ? "room" : "rooms"} found
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-secondary-text" />
            </div>
            <p className="text-[14px] font-semibold text-primary-text mb-1">No rooms found</p>
            <p className="text-[13px] text-secondary-text">Try adjusting your search or filters.</p>
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
