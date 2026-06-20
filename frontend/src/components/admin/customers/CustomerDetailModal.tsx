"use client";

import React from "react";
import { X, Calendar, DollarSign, Clock, Phone, User, Landmark, ShoppingCart } from "lucide-react";
import { Customer } from "@/lib/admin-mock-data";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

// Helper mock bookings per customer
const MOCK_HISTORY_LOGS = [
  { action: "PC 4 band qilindi", details: "Zone: Standard. Davomiyligi: 2 soat.", cost: 20000, date: "2026-06-20 14:10" },
  { action: "Buyurtma berildi", details: "Coca-Cola 0.5L (x1), Lays Chips 90g (x1).", cost: 28000, date: "2026-06-20 14:25" },
  { action: "VIP PC 33 band qilindi", details: "Zone: VIP. Davomiyligi: 3 soat.", cost: 54000, date: "2026-06-18 18:30" },
  { action: "Buyurtma berildi", details: "Double Cheese Burger (x1), RedBull (x1).", cost: 50000, date: "2026-06-18 19:15" },
  { action: "PS5 PC 44 band qilindi", details: "Zone: PS5. Davomiyligi: 4 soat.", cost: 100000, date: "2026-06-15 12:00" }
];

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
}: CustomerDetailModalProps) {
  if (!isOpen || !customer) return null;

  // Derive mock customer details logs
  const customerHistory = MOCK_HISTORY_LOGS.slice(0, 3 + (Number(customer.id.replace("c", "")) % 3));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative glass-card w-full max-w-lg rounded-2xl border border-border-glass bg-background-secondary p-6 shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-accent-glow/10 text-accent-glow flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                {customer.name}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Mijoz faoliyat tarixi va tafsilotlari
              </p>
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Registry Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background-primary/40 border border-border-glass/25 rounded-xl text-left space-y-0.5">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Jami Sarflangan</span>
              <span className="font-heading font-extrabold text-sm sm:text-base text-accent-glow">
                {customer.totalSpent.toLocaleString()} so&apos;m
              </span>
            </div>
            <div className="p-3 bg-background-primary/40 border border-border-glass/25 rounded-xl text-left space-y-0.5">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">A&apos;zo Bo&apos;lgan Sana</span>
              <span className="font-heading font-bold text-xs sm:text-sm text-text-primary flex items-center gap-1.5 pt-0.5">
                <Calendar className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                {customer.joinedAt}
              </span>
            </div>
          </div>

          {/* Contact and Visits */}
          <div className="p-3.5 bg-background-primary/40 border border-border-glass/20 rounded-xl text-left space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-text-secondary" />
                Telefon raqami:
              </span>
              <span className="font-bold text-text-primary">{customer.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-text-secondary" />
                Oxirgi tashrif:
              </span>
              <span className="font-semibold text-text-primary">{customer.lastVisit}</span>
            </div>
          </div>

          {/* Previous History logs timeline */}
          <div className="space-y-2.5 text-left">
            <h4 className="text-xs font-bold text-accent-glow uppercase tracking-wider">
              Oxirgi faolliklar ({customerHistory.length} ta)
            </h4>
            <div className="space-y-2">
              {customerHistory.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background-primary/20 border border-border-glass/10 rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      {log.action.includes("buyurtma") ? (
                        <ShoppingCart className="h-3.5 w-3.5 text-status-free shrink-0" />
                      ) : (
                        <Landmark className="h-3.5 w-3.5 text-accent-glow shrink-0" />
                      )}
                      {log.action}
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <span className="text-[10px] font-bold text-accent-glow block">
                      +{log.cost.toLocaleString()} so&apos;m
                    </span>
                    <span className="text-[8px] text-text-secondary font-medium block">
                      {log.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-3 border-t border-border-glass/40 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg bg-background-primary border border-border-glass hover:border-accent-glow/50 text-text-secondary hover:text-text-primary transition-all duration-200 text-xs font-bold active:scale-95"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
