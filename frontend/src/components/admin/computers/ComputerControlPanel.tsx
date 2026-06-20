"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Square, Plus, RefreshCw, User, Clock, AlertCircle } from "lucide-react";
import { Computer } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

interface ComputerControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  computer: Computer | null;
  onStart: (pcId: string, customerName: string, seconds: number) => void;
  onStop: (pcId: string) => void;
  onAddTime: (pcId: string, additionalSeconds: number) => void;
  onChangePcClick: () => void;
}

export default function ComputerControlPanel({
  isOpen,
  onClose,
  computer,
  onStart,
  onStop,
  onAddTime,
  onChangePcClick,
}: ComputerControlPanelProps) {
  const [customerName, setCustomerName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number>(3600); // default 1 hour in seconds
  const [customMinutes, setCustomMinutes] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [pricing, setPricing] = useState({
    Standard: 10000,
    VIP: 18000,
    PS5: 25000
  });

  useEffect(() => {
    const saved = localStorage.getItem("cclub_zone_prices");
    if (saved) {
      try {
        const prices = JSON.parse(saved);
        setPricing({
          Standard: Number(prices.Standard ?? 10000),
          VIP: Number(prices.VIP ?? 18000),
          PS5: Number(prices.PS5 ?? 25000)
        });
      } catch (e) {}
    }
  }, [isOpen]);

  const getZonePrice = (zone: string) => {
    const price = pricing[zone as keyof typeof pricing] ?? 10000;
    return price < 1000 ? price * 1000 : price;
  };

  // Reset inputs when computer changes
  useEffect(() => {
    if (computer) {
      setCustomerName("");
      setSelectedDuration(3600);
      setCustomMinutes("");
      setIsCustomMode(false);
    }
  }, [computer]);

  if (!isOpen || !computer) return null;

  const isFree = computer.status === "free";

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

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    let seconds = selectedDuration;
    if (isCustomMode) {
      const minutes = parseInt(customMinutes);
      if (isNaN(minutes) || minutes <= 0) {
        alert("Iltimos, to'g'ri vaqt kiriting (daqiqa).");
        return;
      }
      seconds = minutes * 60;
    }

    onStart(computer.id, customerName.trim() || "Mijoz", seconds);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background-primary/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Side Panel Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background-secondary border-l border-border-glass shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "h-3 w-3 rounded-full animate-pulse",
                computer.status === "free"
                  ? "bg-status-free"
                  : computer.status === "occupied"
                  ? "bg-status-occupied"
                  : "bg-status-ending"
              )}
            />
            <div>
              <h2 className="font-heading text-lg font-bold text-text-primary">
                PC {computer.number} Boshqaruvi
              </h2>
              <span className="text-xs text-accent-glow font-bold uppercase tracking-wider">
                {computer.zone} zona
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="text-text-secondary hover:text-text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-lg border border-border-glass/40 hover:border-accent-glow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* Status Details */}
          <div className="glass-card bg-background-primary/50 border border-border-glass/40 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Holati:</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  computer.status === "free"
                    ? "bg-status-free/10 text-status-free border border-status-free/20"
                    : computer.status === "occupied"
                    ? "bg-status-occupied/10 text-status-occupied border border-status-occupied/20"
                    : "bg-status-ending/10 text-status-ending border border-status-ending/20"
                )}
              >
                {computer.status === "free"
                  ? "Bo'sh"
                  : computer.status === "occupied"
                  ? "Band"
                  : "Yaqinda tugaydi"}
              </span>
            </div>

            {/* If band/ending show active session detail */}
            {!isFree && (
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Mijoz:</span>
                  <span className="font-bold text-text-primary flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-text-secondary" />
                    {computer.customerName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Qolgan vaqt:</span>
                  <span className="font-heading font-bold text-sm text-accent-glow flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-text-secondary" />
                    {formatTime(computer.remainingSeconds)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action form / controls */}
          {isFree ? (
            /* START SESSION FORM */
            <form onSubmit={handleStart} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="customer-name" className="text-xs font-semibold text-text-secondary block">
                  Mijoz ismi (Ixtiyoriy)
                </label>
                <div className="relative">
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Mijoz ismini kiriting..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-background-primary border border-border-glass/60 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-secondary block">
                  Vaqt tanlash
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration(1800);
                      setIsCustomMode(false);
                    }}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                      selectedDuration === 1800 && !isCustomMode
                        ? "border-accent-glow bg-accent-primary text-white shadow-accent-glow-sm"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    )}
                  >
                    <span>30 daqiqa</span>
                    <span className="text-[9px] opacity-80">
                      {(getZonePrice(computer.zone) * 0.5).toLocaleString()} so&apos;m
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration(3600);
                      setIsCustomMode(false);
                    }}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                      selectedDuration === 3600 && !isCustomMode
                        ? "border-accent-glow bg-accent-primary text-white shadow-accent-glow-sm"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    )}
                  >
                    <span>1 soat</span>
                    <span className="text-[9px] opacity-80">
                      {(getZonePrice(computer.zone) * 1).toLocaleString()} so&apos;m
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration(7200);
                      setIsCustomMode(false);
                    }}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                      selectedDuration === 7200 && !isCustomMode
                        ? "border-accent-glow bg-accent-primary text-white shadow-accent-glow-sm"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    )}
                  >
                    <span>2 soat</span>
                    <span className="text-[9px] opacity-80">
                      {(getZonePrice(computer.zone) * 2).toLocaleString()} so&apos;m
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration(10800);
                      setIsCustomMode(false);
                    }}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                      selectedDuration === 10800 && !isCustomMode
                        ? "border-accent-glow bg-accent-primary text-white shadow-accent-glow-sm"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    )}
                  >
                    <span>3 soat</span>
                    <span className="text-[9px] opacity-80">
                      {(getZonePrice(computer.zone) * 3).toLocaleString()} so&apos;m
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-xs font-bold border transition-all duration-200",
                    isCustomMode
                      ? "border-accent-glow bg-accent-primary text-white shadow-accent-glow-sm"
                      : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                  )}
                >
                  Boshqa vaqt (Daqiqa)
                </button>

                {isCustomMode && (
                  <div className="relative animate-in slide-in-from-top-2 duration-200">
                    <input
                      type="number"
                      min="1"
                      placeholder="Daqiqalarda kiriting... (Masalan, 45)"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      required
                      className="w-full bg-background-primary border border-accent-glow/55 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Pricing Summary */}
              <div className="rounded-xl bg-background-primary border border-border-glass/40 p-4 mt-4 flex items-center justify-between">
                <span className="text-xs text-text-secondary">Jami hisob:</span>
                <span className="font-heading text-sm font-bold text-accent-glow">
                  {(() => {
                    const hourlyPrice = getZonePrice(computer.zone);
                    let seconds = selectedDuration;
                    if (isCustomMode) {
                      const minutes = parseInt(customMinutes);
                      seconds = isNaN(minutes) ? 0 : minutes * 60;
                    }
                    const totalCost = (hourlyPrice * seconds) / 3600;
                    return `${Math.round(totalCost).toLocaleString()} so&apos;m`;
                  })()}
                </span>
              </div>

              {/* Start Trigger Button */}
              <button
                type="submit"
                className="w-full bg-status-free hover:bg-status-free/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-status-free/10 text-sm mt-6"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
                START (Ishga tushirish)
              </button>
            </form>
          ) : (
            /* ACTIVE SESSION CONTROL OPTIONS */
            <div className="space-y-6">
              {/* Add Time Area */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-secondary block">
                  Vaqt uzaytirish
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onAddTime(computer.id, 900)} // +15 min
                    className="py-2 px-1 rounded-xl border border-border-glass bg-background-primary text-text-primary hover:border-accent-glow/60 hover:bg-accent-deep/10 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all duration-200"
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      15 daq.
                    </span>
                    <span className="text-[9px] text-text-secondary">
                      {(getZonePrice(computer.zone) * 0.25).toLocaleString()} so&apos;m
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddTime(computer.id, 1800)} // +30 min
                    className="py-2 px-1 rounded-xl border border-border-glass bg-background-primary text-text-primary hover:border-accent-glow/60 hover:bg-accent-deep/10 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all duration-200"
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      30 daq.
                    </span>
                    <span className="text-[9px] text-text-secondary">
                      {(getZonePrice(computer.zone) * 0.5).toLocaleString()} so&apos;m
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddTime(computer.id, 3600)} // +60 min
                    className="py-2 px-1 rounded-xl border border-border-glass bg-background-primary text-text-primary hover:border-accent-glow/60 hover:bg-accent-deep/10 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all duration-200"
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      1 soat
                    </span>
                    <span className="text-[9px] text-text-secondary">
                      {(getZonePrice(computer.zone) * 1).toLocaleString()} so&apos;m
                    </span>
                  </button>
                </div>
              </div>

              {/* Transfer Session (Change PC) */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-secondary block">
                  Boshqa kompyuterga o&apos;tkazish
                </span>
                <button
                  type="button"
                  onClick={onChangePcClick}
                  className="w-full py-3 px-4 rounded-xl border border-border-glass bg-background-primary text-text-primary hover:border-accent-glow hover:bg-accent-deep/10 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4 text-accent-glow" />
                  Kompyuterni almashtirish (Change PC)
                </button>
              </div>

              {/* Stop Session Area */}
              <div className="pt-6 border-t border-border-glass/40">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`PC ${computer.number} dagi seansni rostdan ham to'xtatmoqchimisiz?`)) {
                      onStop(computer.id);
                    }
                  }}
                  className="w-full bg-status-occupied hover:bg-status-occupied/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-status-occupied/10 text-sm"
                >
                  <Square className="h-4.5 w-4.5 fill-current" />
                  STOP (Seansni to&apos;xtatish)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
