"use client";

import Link from "next/link";
import { Search, Plus, User } from "lucide-react";
import { useState } from "react";

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="fixed top-4 left-4 right-4 z-[1000] flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 h-[72px] bg-white/80 backdrop-blur-xl border border-border-color rounded-2xl shadow-sm pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
            <span className="text-white font-semibold text-sm leading-none mt-[1px]">R</span>
          </div>
          <span className="font-semibold text-[14px] text-primary-text tracking-tight hidden sm:block">
            RoomUndo
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-border-color transition-all duration-200 focus-within:border-primary-text/30 focus-within:bg-white">
          <Search className="w-4 h-4 text-secondary-text shrink-0" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[14px] text-primary-text placeholder:text-secondary-text/60 py-1"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/add-room"
            className="flex items-center gap-1.5 px-4 h-[36px] text-[13px] font-medium text-white rounded-xl transition-colors"
            style={{ backgroundColor: '#0F172A' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Room</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center w-[36px] h-[36px] text-secondary-text hover:text-primary-text hover:bg-gray-100 rounded-xl transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
