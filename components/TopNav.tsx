"use client";

import Link from "next/link";
import { Search, UserCircle, Plus } from "lucide-react";
import { useState } from "react";

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="absolute top-4 left-0 right-0 z-[1000] px-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="bg-white px-5 py-3 rounded-full shadow-md pointer-events-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none mt-[2px]">R</span>
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-primary-text hidden sm:block">
            RoomUndo
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg bg-white rounded-full shadow-md pointer-events-auto flex items-center px-4 py-2 border border-border-color transition-shadow hover:shadow-lg focus-within:shadow-lg focus-within:border-success/30">
          <Search className="w-5 h-5 text-secondary-text" />
          <input
            type="text"
            placeholder="Search location (e.g. Technopark)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none px-3 py-1 text-primary-text placeholder:text-secondary-text/70"
          />
          <button className="bg-success text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-success/90 transition-colors">
            Search
          </button>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-full shadow-md pointer-events-auto flex items-center p-1 border border-border-color">
          <Link
            href="/admin/add-room"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-text hover:bg-gray-50 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Room</span>
          </Link>
          <div className="w-[1px] h-6 bg-border-color mx-1" />
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-text hover:bg-gray-50 rounded-full transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
