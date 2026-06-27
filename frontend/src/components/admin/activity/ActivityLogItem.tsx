"use client";

import React from "react";
import { ActivityLog } from "@/lib/admin-mock-data";
import { Monitor, ShoppingBag, Package, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLogItemProps {
  log: ActivityLog;
}

export default function ActivityLogItem({ log }: ActivityLogItemProps) {
  const { action, details, timestamp, type } = log;

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

  const getLogStyle = (logType: ActivityLog["type"]) => {
    switch (logType) {
      case "pc":
        return {
          bg: "bg-accent-glow/10 text-accent-glow border-accent-glow/20",
          icon: Monitor
        };
      case "order":
        return {
          bg: "bg-status-free/10 text-status-free border-status-free/20",
          icon: ShoppingBag
        };
      case "product":
        return {
          bg: "bg-status-ending/10 text-status-ending border-status-ending/20",
          icon: Package
        };
      case "system":
        default:
          return {
            bg: "bg-text-secondary/10 text-text-secondary border-text-secondary/20",
            icon: Info
          };
    }
  };

  const style = getLogStyle(type);
  const Icon = style.icon;

  return (
    <div className="glass-card /30 /35  p-3.5 flex items-start gap-3.5 hover:border-border-glass/60 transition-colors animate-in fade-in slide-in-from-top-1.5 duration-200">
      {/* Icon frame */}
      <div
        className={cn(
          "h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-xs border",
          style.bg
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      {/* Main text area */}
      <div className="flex-1 min-w-0 text-left space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
            {action}
          </h4>
          <span className="text-[10px] text-text-secondary shrink-0 font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(timestamp)}
          </span>
        </div>
        <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed break-words">
          {details}
        </p>
      </div>
    </div>
  );
}
