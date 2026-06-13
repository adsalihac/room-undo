"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, List, PlusCircle, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
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
      <aside className="w-full md:w-60 bg-surface border-r border-border-color flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-border-color">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={26} />
          </Link>
          <span className="text-[11px] text-secondary-text mt-0.5 block font-medium uppercase tracking-wider">Admin</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-secondary-text hover:text-primary-text hover:bg-accent-light"
                }`}
                style={isActive ? { backgroundColor: '#0F172A' } : undefined}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border-color">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-secondary-text hover:text-error hover:bg-error-bg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
