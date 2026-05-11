"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  Wallet,
  Package,
  BarChart3,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/bookings", icon: Calendar, label: "Bookings" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/transactions", icon: Wallet, label: "Transactions" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/profit-analysis", icon: BarChart3, label: "Profit Analysis" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg font-bold">Ellen's Salon</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{session?.user?.name}</span>
          <button
            onClick={() => signOut()}
            className="p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
          <button
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex md:flex-row fixed md:static bottom-0 left-0 right-0 md:bottom-auto md:top-auto bg-white md:bg-gray-100 border-t md:border-t-0 md:border-r border-gray-200 md:flex-col w-full md:w-64 h-auto md:h-[calc(100vh-64px)] overflow-y-auto`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
              isActive(item.href)
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
