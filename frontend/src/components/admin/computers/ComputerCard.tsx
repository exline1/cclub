"use client";

import React from "react";
import { Computer } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";
import { Monitor, User } from "lucide-react";

interface ComputerCardProps {
  computer: Computer;
  onClick: () => void;
}

export default function ComputerCard({ computer, onClick }: ComputerCardProps) {
  // Format seconds to hh:mm:ss or mm:ss
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isFree = computer.status === "free";
  const isOccupied = computer.status === "occupied";
  const isEnding = computer.status === "ending_soon";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col justify-between p-3.5 rounded-2xl border text-center transition-all duration-300 aspect-square select-none cursor-pointer active:scale-95 group",
        isFree && "border-status-free/20 bg-status-free/5 text-status-free hover:border-status-free/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        isOccupied && "border-status-occupied/20 bg-status-occupied/5 text-status-occupied hover:border-status-occupied/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-in fade-in duration-200",
        isEnding && "border-status-ending/25 bg-status-ending/5 text-status-ending hover:border-status-ending/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse"
      )}
    >
      {/* Zone Indicator (Small badge top-left) */}
      <span className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider opacity-60">
        {computer.zone}
      </span>

      {/* Connection Monitor Icon (Small icon top-right) */}
      <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity">
        <Monitor className="h-3 w-3" />
      </div>

      {/* Large PC Number in the Center */}
      <div className="flex-1 flex flex-col items-center justify-center pt-2">
        <span
          className={cn(
            "font-heading font-black text-3xl sm:text-4xl tracking-tighter transition-transform duration-300 group-hover:scale-110",
            isFree && "text-text-primary",
            isOccupied && "text-status-occupied",
            isEnding && "text-status-ending"
          )}
        >
          {computer.number}
        </span>
      </div>

      {/* Footer Info (Customer name & Countdown time if active) */}
      <div className="mt-1 flex flex-col items-center min-h-[30px] justify-end">
        {!isFree ? (
          <>
            {/* Customer Name */}
            {computer.customerName && (
              <span className="text-[10px] font-semibold text-text-primary truncate max-w-[90px] flex items-center gap-0.5 opacity-90">
                <User className="h-2.5 w-2.5 opacity-60 shrink-0" />
                {computer.customerName}
              </span>
            )}
            {/* Remaining Time */}
            <span
              className={cn(
                "text-[10px] font-heading font-bold tabular-nums mt-0.5",
                isOccupied && "text-text-secondary",
                isEnding && "text-status-ending"
              )}
            >
              {formatTime(computer.remainingSeconds)}
            </span>
          </>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-wider text-status-free/60">
            Bo&apos;sh
          </span>
        )}
      </div>
    </div>
  );
}
