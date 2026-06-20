"use client";

import { useState, useEffect } from "react";
import NotificationDropdown from "@/components/admin/orders/NotificationDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Monitor, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  History, 
  Settings, 
  Menu, 
  X, 
  ArrowLeft 
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { MOCK_ORDERS } from "@/lib/admin-mock-data";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem("gameclub_admin_orders");
      if (saved) {
        try {
          const orders = JSON.parse(saved);
          const count = orders.filter((o: any) => o.status === "pending").length;
          setPendingCount(count);
        } catch (e) {
          // ignore
        }
      } else {
        const count = MOCK_ORDERS.filter(o => o.status === "pending").length;
        setPendingCount(count);
      }
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("gameclub_orders_updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("gameclub_orders_updated", updateCount);
    };
  }, []);

  const MENU_ITEMS = [
    { href: "/admin", label: "Bosh sahifa", icon: LayoutDashboard },
    { href: "/admin/computers", label: "Kompyuterlar", icon: Monitor },
    { 
      href: "/admin/orders", 
      label: "Buyurtmalar", 
      icon: ShoppingCart,
      badge: pendingCount > 0 ? pendingCount : undefined 
    },
    { href: "/admin/products", label: "Mahsulotlar", icon: Package },
    { href: "/admin/customers", label: "Mijozlar", icon: Users },
    { href: "/admin/shift", label: "Smena/Hisobot", icon: BarChart3 },
    { href: "/admin/activity", label: "Faoliyat jurnali", icon: History },
    { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-background-secondary border-r border-border-glass shrink-0 flex-col sticky top-0 h-screen">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border-glass/40 flex items-center gap-3">
          <Logo showText={false} className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-wide">GameClub Hub</span>
            <span className="text-[10px] text-accent-glow font-bold uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 group active:scale-[0.98]",
                  isActive
                    ? "bg-accent-primary/20 text-white font-bold border-l-2 border-accent-glow rounded-l-none pl-2.5"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-primary/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-accent-glow" : "text-text-secondary group-hover:text-text-primary")} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-status-occupied text-[10px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-glass/40">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2 border border-border-glass/50 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent-glow transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Saytga qaytish
          </Link>
        </div>
      </aside>

      {/* Sidebar Mobile (Slide Over Drawer) */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background-primary/80 backdrop-blur-sm lg:hidden transition-all duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      />
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-background-secondary border-r border-border-glass flex flex-col transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border-glass/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo showText={false} className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm tracking-wide">GameClub Hub</span>
              <span className="text-[10px] text-accent-glow font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Yopish"
            className="text-text-secondary hover:text-text-primary p-1 border border-border-glass/40 rounded-lg"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 group active:scale-[0.98]",
                  isActive
                    ? "bg-accent-primary/20 text-white font-bold border-l-2 border-accent-glow rounded-l-none pl-2.5"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-primary/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-accent-glow" : "text-text-secondary group-hover:text-text-primary")} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-status-occupied text-[10px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-glass/40">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2 border border-border-glass/50 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent-glow transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Saytga qaytish
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Unified Header Bar */}
        <header className="h-14 bg-background-secondary/80 backdrop-blur-md border-b border-border-glass px-4 flex items-center justify-between sticky top-0 z-40 select-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Menyuni ochish"
              className="lg:hidden text-text-secondary hover:text-text-primary p-1.5 border border-border-glass/40 rounded-lg active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo showText={false} className="h-7 w-7 lg:hidden" />
            <span className="hidden lg:inline font-heading font-bold text-xs tracking-wider uppercase text-text-secondary">
              GameClub Hub Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
          </div>
        </header>

        {/* Content Shell */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
