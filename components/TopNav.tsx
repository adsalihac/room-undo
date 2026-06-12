"use client";

import Link from "next/link";
import { Plus, User } from "lucide-react";
import Logo from "./Logo";

export default function TopNav() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-[1000] flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 h-[72px] bg-white/80 backdrop-blur-xl border border-border-color rounded-2xl shadow-sm pointer-events-auto">
        <Link href="/" className="shrink-0">
          <Logo size={28} />
        </Link>

        <div className="flex-1" />

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
