"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, List, PlusCircle, Settings, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row bg-gray-50 overflow-hidden w-full h-full">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border-color flex flex-col shrink-0">
        <div className="p-6 border-b border-border-color">
          <Link href="/" className="font-bold text-xl tracking-tight text-primary-text flex items-center gap-2">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none mt-[2px]">R</span>
            </div>
            RoomUndo
          </Link>
          <span className="text-xs text-secondary-text mt-1 block px-10">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary-text hover:bg-gray-50 font-medium transition-colors">
            <Home className="w-5 h-5 text-secondary-text" />
            Dashboard
          </Link>
          <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary-text hover:bg-gray-50 font-medium transition-colors">
            <List className="w-5 h-5 text-secondary-text" />
            Rooms
          </Link>
          <Link href="/admin/add-room" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary-text hover:bg-gray-50 font-medium transition-colors">
            <PlusCircle className="w-5 h-5 text-secondary-text" />
            Add Room
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary-text hover:bg-gray-50 font-medium transition-colors">
            <Settings className="w-5 h-5 text-secondary-text" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border-color">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/10 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
