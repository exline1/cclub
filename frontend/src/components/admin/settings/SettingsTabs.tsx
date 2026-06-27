"use client";

import React, { useState, useEffect } from "react";
import { Save, ShieldCheck, DollarSign, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabKey = "pricing" | "hours" | "info";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("pricing");

  // State fields
  // 1. Zone Pricing
  const [standardPrice, setStandardPrice] = useState("10.000");
  const [vipPrice, setVipPrice] = useState("18.000");
  const [ps5Price, setPs5Price] = useState("25.000");

  // 2. Club Operating Hours
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("23:00");

  // 3. Club Information
  const [clubName, setClubName] = useState("cclub");
  const [clubAddress, setClubAddress] = useState("Toshkent sh., Yunusobod t.");
  const [clubPhone, setClubPhone] = useState("+998 90 123 45 67");

  // Initial Load from LocalStorage
  useEffect(() => {
    // 1. Load Pricing
    const savedPricing = localStorage.getItem("cclub_zone_prices");
    if (savedPricing) {
      try {
        const prices = JSON.parse(savedPricing);
        setStandardPrice(String(prices.Standard ?? 10.000));
        setVipPrice(String(prices.VIP ?? 18.000));
        setPs5Price(String(prices.PS5 ?? 25.000));
      } catch (e) {}
    }

    // 2. Load Hours
    const savedHours = localStorage.getItem("cclub_club_hours");
    if (savedHours) {
      try {
        const hours = JSON.parse(savedHours);
        setOpenTime(hours.open ?? "09:00");
        setCloseTime(hours.close ?? "23:00");
      } catch (e) {}
    }

    // 3. Load Club Info
    const savedInfo = localStorage.getItem("cclub_club_info");
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo);
        setClubName(info.name ?? "cclub");
        setClubAddress(info.address ?? "Toshkent sh., Yunusobod t.");
        setClubPhone(info.phone ?? "+998 90 123 45 67");
      } catch (e) {}
    }
  }, []);

  // Save Handlers
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    const std = Number(standardPrice);
    const vip = Number(vipPrice);
    const ps5 = Number(ps5Price);

    if (isNaN(std) || std < 0 || isNaN(vip) || vip < 0 || isNaN(ps5) || ps5 < 0) {
      toast.error("Tarif narxlari manfiy bo'lmasligi kerak!");
      return;
    }

    const prices = { Standard: std, VIP: vip, PS5: ps5 };
    localStorage.setItem("cclub_zone_prices", JSON.stringify(prices));
    toast.success("Tarif narxlari muvaffaqiyatli saqlandi!");
    
    logActivity("Tizim sozlamalari o'zgartirildi", "Zonalar tarif narxlari yangilandi.", "system");
  };

  const handleSaveHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openTime || !closeTime) {
      toast.error("Iltimos, ish vaqtini to'liq kiriting!");
      return;
    }

    const hours = { open: openTime, close: closeTime };
    localStorage.setItem("cclub_club_hours", JSON.stringify(hours));
    toast.success("Klub ish vaqti muvaffaqiyatli saqlandi!");

    logActivity("Klub ish vaqti o'zgartirildi", `Ochilish: ${openTime}, yopilish: ${closeTime}.`, "system");
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !clubAddress.trim() || !clubPhone.trim()) {
      toast.error("Iltimos, klub ma'lumotlarini to'liq to'ldiring!");
      return;
    }

    const info = { name: clubName.trim(), address: clubAddress.trim(), phone: clubPhone.trim() };
    localStorage.setItem("cclub_club_info", JSON.stringify(info));
    toast.success("Klub ma'lumotlari muvaffaqiyatli saqlandi!");

    logActivity("Klub profili yangilandi", `Nomi: ${clubName}.`, "system");
  };

  const logActivity = (action: string, details: string, type: "pc" | "order" | "system" | "product") => {
    const savedLogs = localStorage.getItem("cclub_admin_activity");
    let logs = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch (e) {}
    }
    const newLog = {
      id: `a_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    localStorage.setItem("cclub_admin_activity", JSON.stringify([newLog, ...logs].slice(0, 100)));
    window.dispatchEvent(new Event("cclub_activity_updated"));
  };

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: "pricing", label: "Zonalar narxi", icon: DollarSign },
    { key: "hours", label: "Klub ish vaqti", icon: Clock },
    { key: "info", label: "Klub ma'lumotlari", icon: Info }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start text-left select-none animate-in fade-in duration-300">
      {/* Sidebar Tabs Links */}
      <div className="flex lg:flex-col bg-background-secondary/50 border border-border-glass/40 p-1.5 rounded-3xl w-full lg:w-56 shrink-0 gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all active:scale-95",
                activeTab === tab.key
                  ? "bg-accent-primary text-white shadow-accent-glow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-background-primary/20"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="hidden sm:inline lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Form Containers */}
      <div className="flex-1 w-full /30 /40  p-5 sm:p-6 glass-card">
        {activeTab === "pricing" && (
          <form onSubmit={handleSavePricing} className="space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary border-b border-border-glass/25 pb-2 mb-4">
              Zonalar narxi (UZS / soat)
            </h3>

            <div className="space-y-3.5 max-w-sm">
              <div className="space-y-1">
                <label htmlFor="std-price" className="text-xs font-semibold text-text-secondary block">
                  Standard Zona narxi
                </label>
                <div className="relative">
                  <input
                    id="std-price"
                    type="number"
                    min="0"
                    value={standardPrice}
                    onChange={(e) => setStandardPrice(e.target.value)}
                    className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="vip-price" className="text-xs font-semibold text-text-secondary block">
                  VIP Zona narxi
                </label>
                <div className="relative">
                  <input
                    id="vip-price"
                    type="number"
                    min="0"
                    value={vipPrice}
                    onChange={(e) => setVipPrice(e.target.value)}
                    className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="ps5-price" className="text-xs font-semibold text-text-secondary block">
                  PS5 Zona narxi
                </label>
                <div className="relative">
                  <input
                    id="ps5-price"
                    type="number"
                    min="0"
                    value={ps5Price}
                    onChange={(e) => setPs5Price(e.target.value)}
                    className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-accent-glow hover:bg-accent-glow/90 border border-accent-glow/50 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-accent-glow/15"
            >
              <Save className="h-4 w-4" />
              Narxlarni Saqlash
            </button>
          </form>
        )}

        {activeTab === "hours" && (
          <form onSubmit={handleSaveHours} className="space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary border-b border-border-glass/25 pb-2 mb-4">
              Klub ish vaqti sozlamalari
            </h3>

            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="space-y-1">
                <label htmlFor="open-time" className="text-xs font-semibold text-text-secondary block">
                  Ochilish vaqti
                </label>
                <input
                  id="open-time"
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="close-time" className="text-xs font-semibold text-text-secondary block">
                  Yopilish vaqti
                </label>
                <input
                  id="close-time"
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-accent-glow hover:bg-accent-glow/90 border border-accent-glow/50 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-accent-glow/15"
            >
              <Save className="h-4 w-4" />
              Ish Vaqtini Saqlash
            </button>
          </form>
        )}

        {activeTab === "info" && (
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary border-b border-border-glass/25 pb-2 mb-4">
              Klub profilingiz va ma&apos;lumotlar
            </h3>

            <div className="space-y-3.5 max-w-md">
              <div className="space-y-1">
                <label htmlFor="club-name" className="text-xs font-semibold text-text-secondary block">
                  Klub nomi
                </label>
                <input
                  id="club-name"
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="club-addr" className="text-xs font-semibold text-text-secondary block">
                  Klub manzili
                </label>
                <input
                  id="club-addr"
                  type="text"
                  value={clubAddress}
                  onChange={(e) => setClubAddress(e.target.value)}
                  className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="club-phone" className="text-xs font-semibold text-text-secondary block">
                  Klub telefoni
                </label>
                <input
                  id="club-phone"
                  type="text"
                  value={clubPhone}
                  onChange={(e) => setClubPhone(e.target.value)}
                  className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-glow transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-accent-glow hover:bg-accent-glow/90 border border-accent-glow/50 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-accent-glow/15"
            >
              <Save className="h-4 w-4" />
              Ma&apos;lumotlarni Saqlash
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
