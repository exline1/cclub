"use client";

import React, { useState, useEffect } from "react";
import { Bell, ShoppingBag, AlertTriangle, Info, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string; // ISO string
  type: "order" | "pc" | "system";
  isRead: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial load
  const loadNotifications = () => {
    const saved = localStorage.getItem("cclub_admin_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications([]);
      }
    } else {
      // Mock initial notification if none exist
      const initial: NotificationItem[] = [
        {
          id: "n1",
          title: "Smena boshlandi",
          message: "Tizim muvaffaqiyatli ishga tushirildi. Yangi smena ochiq.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          type: "system",
          isRead: true,
        },
      ];
      setNotifications(initial);
      localStorage.setItem("cclub_admin_notifications", JSON.stringify(initial));
    }
  };

  useEffect(() => {
    loadNotifications();
    setIsMounted(true);

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("cclub_notifications_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cclub_notifications_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // 2. Outside click close handler
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notification-dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // When opening, mark all notifications as read
    if (!isOpen && notifications.some((n) => !n.isRead)) {
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      localStorage.setItem("cclub_admin_notifications", JSON.stringify(updated));
      // Dispatch event to refresh other notification counters
      window.dispatchEvent(new Event("cclub_notifications_updated"));
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem("cclub_admin_notifications", JSON.stringify([]));
    window.dispatchEvent(new Event("cclub_notifications_updated"));
  };

  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Hozirgina";
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Hozirgina";
    if (diffMins < 60) return `${diffMins} daq. oldin`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} soat oldin`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isMounted) return null;

  return (
    <div className="relative notification-dropdown-container select-none">
      {/* Bell Trigger Icon */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "relative p-2 rounded-full border border-border-glass/40 bg-background-secondary/30 hover:border-accent-glow hover:text-accent-glow hover:bg-background-primary transition-all duration-200 active:scale-95",
          isOpen && "border-accent-glow text-accent-glow bg-background-primary"
        )}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-status-occupied text-[8px] font-extrabold text-white animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-border-glass bg-background-secondary p-4 shadow-2xl z-50 flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-glass/40 pb-2 mb-3">
            <span className="font-heading text-xs sm:text-sm font-bold text-text-primary">
              Bildirishnomalar ({notifications.length})
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[10px] font-bold text-text-secondary hover:text-status-occupied flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Tozalash
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-text-secondary">
                <CheckCircle className="h-8 w-8 text-status-free mb-2 opacity-60" />
                <p className="text-xs font-semibold">Bildirishnomalar yo&apos;q</p>
                <p className="text-[10px] opacity-75 mt-0.5">Klubda hamma narsa tinch.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const isOrder = item.type === "order";
                const isPc = item.type === "pc";

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-3 p-3 rounded-2xl border border-border-glass/30 bg-background-primary/40 hover:border-accent-glow/40 transition-colors",
                      !item.isRead && "border-accent-glow/30 bg-accent-deep/5"
                    )}
                  >
                    {/* Icon matching Type */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs",
                        isOrder
                          ? "bg-status-free/10 text-status-free"
                          : isPc
                          ? "bg-status-ending/10 text-status-ending"
                          : "bg-accent-glow/10 text-accent-glow"
                      )}
                    >
                      {isOrder ? (
                        <ShoppingBag className="h-4.5 w-4.5" />
                      ) : isPc ? (
                        <AlertTriangle className="h-4.5 w-4.5" />
                      ) : (
                        <Info className="h-4.5 w-4.5" />
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 space-y-0.5 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-text-primary truncate">
                          {item.title}
                        </span>
                        <span className="text-[9px] text-text-secondary shrink-0 font-medium">
                          {getRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-relaxed break-words">
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer dummy actions */}
          <div className="border-t border-border-glass/40 pt-2.5 mt-3 text-center shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-accent-glow hover:text-accent-glow/85 transition-colors uppercase tracking-wider"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
