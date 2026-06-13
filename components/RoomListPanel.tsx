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
          <Logo size={24} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/add-room"
            className="inline-flex items-center gap-1.5 px-5 h-[38px] text-[13px] font-extrabold text-white rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: "#FF385C" }}
          >
            <Plus className="w-4 h-4" />
            <span>Post Room</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-[38px] h-[38px] text-secondary-text rounded-full hover:bg-accent-blue-bg hover:text-accent-blue transition-colors border border-border-color/50"
            aria-label="Login"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-5 pt-4 pb-3 border-b border-border-color/70 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="w-full pl-10 pr-4 h-[42px] rounded-xl border border-border-color bg-background text-[14px] text-primary-text font-semibold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`shrink-0 px-4 h-[32px] rounded-full text-[12px] font-extrabold transition-all ${
                filterType === type
                  ? "text-white shadow-sm"
                  : "text-secondary-text bg-background border border-border-color hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={filterType === type ? { backgroundColor: "#FF385C" } : undefined}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border-color/30">
        <p className="text-[12px] font-bold text-secondary-text">
          {filtered.length} {filtered.length === 1 ? "room" : "rooms"} found
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mb-4 shadow-sm">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <p className="text-[16px] font-extrabold text-primary-text mb-1">No rooms found</p>
            <p className="text-[14px] text-secondary-text font-semibold">Try adjusting your search or filters.</p>
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
