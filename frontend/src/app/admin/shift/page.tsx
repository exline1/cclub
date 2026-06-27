"use client";

import React, { useState, useEffect } from "react";
import { Coins, Monitor, ShoppingCart, Users, PowerOff, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import ShiftChart from "@/components/admin/shift/ShiftChart";
import ShiftCloseModal from "@/components/admin/shift/ShiftCloseModal";

export default function ShiftAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShiftClosed, setIsShiftClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mock shift earnings
  const pcEarnings = 1250000;
  const barEarnings = 620000;
  const servedCount = 45;

  useEffect(() => {
    // Check if shift is closed from localStorage
    const saved = localStorage.getItem("cclub_admin_shift_closed");
    if (saved === "true") {
      setIsShiftClosed(true);
    }
    setIsMounted(true);
  }, []);

  const handleConfirmClose = () => {
    setIsShiftClosed(true);
    localStorage.setItem("cclub_admin_shift_closed", "true");
    toast.success("Smena yopildi!");
    
    // Log system activity event
    const savedLogs = localStorage.getItem("cclub_admin_activity");
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {}
    }
    const newLog = {
      id: `a_${Date.now()}`,
      action: "Smena yopildi",
      details: `Bugungi smena yakunlandi. Jami tushum: ${(pcEarnings + barEarnings).toLocaleString()} so'm.`,
      timestamp: new Date().toISOString(),
      type: "system" as const
    };
    localStorage.setItem("cclub_admin_activity", JSON.stringify([newLog, ...logs].slice(0, 100)));
    window.dispatchEvent(new Event("cclub_activity_updated"));
  };

  const handleReopenShift = () => {
    setIsShiftClosed(false);
    localStorage.removeItem("cclub_admin_shift_closed");
    toast.info("Yangi smena ochildi!");
  };

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Smena &amp; Hisobotlar
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 animate-pulse">
            {isShiftClosed ? (
              <span className="text-status-occupied font-bold">SMENA YOPILGAN</span>
            ) : (
              <span>Smena faol • Boshlandi: bugun 09:00</span>
            )}
          </p>
        </div>

        {/* Action closures */}
        {!isShiftClosed ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-status-occupied hover:bg-status-occupied/90 border border-status-occupied/35 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-status-occupied/10 shrink-0"
          >
            <PowerOff className="h-4 w-4 shrink-0" />
            Smenani yopish
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReopenShift}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-status-free hover:bg-status-free/90 border border-status-free/35 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-status-free/10 shrink-0"
          >
            Yangi smena ochish
          </button>
        )}
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 select-none">
        {/* PC earnings */}
        <div className="glass-card /40 /30 p-4  flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
              PC daromadi
            </span>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-accent-glow">
              {pcEarnings.toLocaleString()} so&apos;m
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-accent-glow/10 text-accent-glow flex items-center justify-center border border-accent-glow/20">
            <Monitor className="h-5 w-5" />
          </div>
        </div>

        {/* Bar earnings */}
        <div className="glass-card /40 /30 p-4  flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
              Bar / Oshxona
            </span>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-status-free">
              {barEarnings.toLocaleString()} so&apos;m
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-status-free/10 text-status-free flex items-center justify-center border border-status-free/20">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>

        {/* Total */}
        <div className="glass-card /40 /30 p-4  flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
              Jami tushum
            </span>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-text-primary">
              {(pcEarnings + barEarnings).toLocaleString()} so&apos;m
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-text-primary/10 text-text-primary flex items-center justify-center border border-border-glass/25">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Serviced count */}
        <div className="glass-card /40 /30 p-4  flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
              Mijozlar soni
            </span>
            <p className="text-lg sm:text-xl font-heading font-extrabold text-status-ending">
              {servedCount} ta
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-status-ending/10 text-status-ending flex items-center justify-center border border-status-ending/20">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <ShiftChart />

      {/* Modal Closer summary */}
      <ShiftCloseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmClose={handleConfirmClose}
        servedCount={servedCount}
        pcEarnings={pcEarnings}
        barEarnings={barEarnings}
        isShiftClosed={isShiftClosed}
      />
    </main>
  );
}
