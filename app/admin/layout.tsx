"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, List, PlusCircle, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: List },
  { href: "/admin/add-room", label: "Add Room", icon: PlusCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row bg-background h-full w-full">
      <aside className="w-full md:w-64 bg-surface border-r border-border-color/70 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-border-color/70">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
          </Link>
          <span className="text-[11px] font-bold text-secondary-text mt-1 block uppercase tracking-wider">Admin Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-secondary-text hover:text-primary-text hover:bg-accent-light"
                }`}
                style={isActive ? { backgroundColor: "#0F172A" } : undefined}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-color/70">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-secondary-text hover:text-error hover:bg-error-bg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
