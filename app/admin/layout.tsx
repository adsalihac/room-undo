"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, List, PlusCircle, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row bg-background overflow-hidden w-full h-full">
      <aside className="w-full md:w-64 bg-surface border-r border-border-color flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-border-color">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
          </Link>
          <span className="text-[12px] text-secondary-text mt-0.5 block font-medium uppercase tracking-[0.12em]">Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-primary-text hover:bg-gray-100 font-medium transition-colors">
            <Home className="w-4 h-4 text-secondary-text" />
            Dashboard
          </Link>
          <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-primary-text hover:bg-gray-100 font-medium transition-colors">
            <List className="w-4 h-4 text-secondary-text" />
            Rooms
          </Link>
          <Link href="/admin/add-room" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-primary-text hover:bg-gray-100 font-medium transition-colors">
            <PlusCircle className="w-4 h-4 text-secondary-text" />
            Add Room
          </Link>
        </nav>

        <div className="p-3 border-t border-border-color">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-error hover:bg-error/10 font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 md:p-10">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
