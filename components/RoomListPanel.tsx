"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, User, Heart, BarChart3 } from "lucide-react";
import Link from "next/link";
import RoomCard from "./RoomCard";
import Logo from "./Logo";
import Footer from "./Footer";
import CompareModal from "./CompareModal";
import type { Room } from "./MapComponent";

interface RoomListPanelProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (room: Room) => void;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl border-2 border-border-color/50 bg-surface p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-gray-200" />
          <div className="h-3 w-1/2 rounded-full bg-gray-200" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="flex items-end justify-between pt-3 border-t border-border-color/50">
        <div className="space-y-1.5">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-3 w-8 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="h-3 w-14 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function RoomListPanel({ rooms, selectedRoomId, onRoomSelect, loading }: RoomListPanelProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showSavedRooms, setShowSavedRooms] = useState(false);
  const [compareRooms, setCompareRooms] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Get saved rooms from localStorage
  const [savedRooms, setSavedRooms] = useState<string[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("savedRooms");
    if (stored) {
      setSavedRooms(JSON.parse(stored));
    }
  }, []);

  // Listen for localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "savedRooms" && e.newValue) {
        setSavedRooms(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const propertyTypes = ["All", ...new Set(rooms.map((r) => r.property_type))];
  const maxPrice = useMemo(() => Math.max(...rooms.map((r) => r.price), 10000), [rooms]);

  // Get saved room objects
  const savedRoomObjects = rooms.filter((room) => savedRooms.includes(room.id));

  // Combined and filtered rooms based on current view
  const displayRooms = showSavedRooms
    ? savedRoomObjects.filter((room) => {
        const matchSearch =
          !search ||
          room.title.toLowerCase().includes(search.toLowerCase()) ||
          room.location_name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      })
    : rooms.filter((room) => {
        const matchSearch =
          !search ||
          room.title.toLowerCase().includes(search.toLowerCase()) ||
          room.location_name.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === "All" || room.property_type === filterType;
        const matchPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
        return matchSearch && matchType && matchPrice;
      });

  const filtered = rooms.filter((room) => {
    const matchSearch =
      !search ||
      room.title.toLowerCase().includes(search.toLowerCase()) ||
      room.location_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || room.property_type === filterType;
    const matchPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    return matchSearch && matchType && matchPrice;
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

      {/* Saved Rooms Toggle */}
      {savedRooms.length > 0 && (
        <div className="px-5 py-2 border-b border-border-color/30 bg-surface sticky top-0 z-10">
          <button
            onClick={() => setShowSavedRooms(!showSavedRooms)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all border-2 ${showSavedRooms
              ? "bg-red-50 border-red-200 shadow-sm"
              : "bg-background border-border-color hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart
                className={`w-4 h-4 ${showSavedRooms ? "fill-red-500 text-red-500" : "text-secondary-text"}`}
              />
              <span className="text-[14px] font-extrabold" style={{ color: showSavedRooms ? "#DC2626" : "#222222" }}>
                Saved Rooms ({savedRooms.length})
              </span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${showSavedRooms ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

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

      {/* Price range */}
      <div className="px-5 py-3 border-b border-border-color/30">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-[12px] font-bold text-secondary-text">
            ₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}
          </span>
        </div>
        <div className="relative h-6">
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full w-full"
            style={{ backgroundColor: "#EEEEEE" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
            style={{
              left: `${(priceRange[0] / maxPrice) * 100}%`,
              width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`,
              backgroundColor: "#FF385C",
            }}
          />
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 1000), priceRange[1]])
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ pointerEvents: "auto" }}
          />
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1000)])
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            style={{ pointerEvents: "auto" }}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border-color/30">
        <p className="text-[12px] font-bold text-secondary-text">
          {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "room" : "rooms"} found`}
        </p>
        <div className="flex items-center gap-2">
          {compareRooms.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 px-3 h-[30px] rounded-full text-[12px] font-extrabold text-white transition-all hover:shadow-md"
              style={{ backgroundColor: "#FF385C" }}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compare ({compareRooms.length})
            </button>
          )}
          {compareRooms.length > 0 && (
            <button
              onClick={() => setCompareRooms([])}
              className="text-[11px] font-bold text-secondary-text hover:text-accent transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : displayRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mb-4 shadow-sm">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <p className="text-[16px] font-extrabold text-primary-text mb-1">No rooms found</p>
            <p className="text-[14px] text-secondary-text font-semibold">Try adjusting your search or filters.</p>
          </div>
        ) : (
          displayRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoomId === room.id}
              onClick={() => onRoomSelect(room)}
              savedRooms={savedRooms}
              toggleSaved={(roomId: string) => {
                const updated = savedRooms.includes(roomId)
                  ? savedRooms.filter((id) => id !== roomId)
                  : [...savedRooms, roomId];
                setSavedRooms(updated);
                localStorage.setItem("savedRooms", JSON.stringify(updated));
                window.dispatchEvent(new StorageEvent("storage", {
                  key: "savedRooms",
                  newValue: JSON.stringify(updated),
                  oldValue: JSON.stringify(savedRooms),
                }));
              }}
              comparisonMode={!showSavedRooms}
              compareSelected={compareRooms.includes(room.id)}
              onCompareToggle={(roomId) => {
                setCompareRooms((prev) =>
                  prev.includes(roomId)
                    ? prev.filter((id) => id !== roomId)
                    : prev.length < 3
                      ? [...prev, roomId]
                      : prev
                );
              }}
            />
          ))
        )}
      </div>

      {showCompareModal && (
        <CompareModal
          rooms={rooms.filter((r) => compareRooms.includes(r.id))}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
