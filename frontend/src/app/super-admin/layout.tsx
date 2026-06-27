"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, List, Users, Settings, LogOut, Bell } from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Klub Arizalari", href: "/super-admin/approvals", icon: CheckSquare },
  { name: "Barcha Klublar", href: "/super-admin/clubs", icon: List },
  { name: "Foydalanuvchilar", href: "/super-admin/users", icon: Users },
  { name: "Sozlamalar", href: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background-primary text-text-primary">
      {/* Sidebar */}
      <div className="w-64 bg-background-secondary border-r border-border-primary flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border-primary">
          <Link href="/super-admin" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-accent-primary to-accent-glow bg-clip-text text-xl font-heading font-black tracking-tight text-transparent">
              cClub
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-status-occupied/20 text-status-occupied border border-status-occupied/30">
              SUPER ADMIN
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-accent-primary/10 text-accent-primary" 
                    : "text-text-secondary hover:bg-background-tertiary hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-accent-primary" : "text-text-secondary"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-primary">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-status-occupied hover:bg-status-occupied/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Tizimdan chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-background-secondary border-b border-border-primary flex items-center justify-between px-8">
          <h1 className="text-lg font-bold font-heading text-white">Super Admin Paneli</h1>
          
          <div className="flex items-center gap-6">
            <button className="relative text-text-secondary hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              {/* Badge for unread notifications */}
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-status-occupied ring-2 ring-background-secondary"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-border-primary pl-6">
              <div className="h-8 w-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-accent-primary">SA</span>
              </div>
              <span className="text-sm font-medium">Asosiy Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-background-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
