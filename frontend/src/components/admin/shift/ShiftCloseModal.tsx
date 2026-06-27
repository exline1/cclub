"use client";

import React from "react";
import { X, CheckCircle, AlertTriangle, ShieldAlert, Award, Calendar, Wallet } from "lucide-react";

interface ShiftCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClose: () => void;
  servedCount: number;
  pcEarnings: number;
  barEarnings: number;
  isShiftClosed: boolean;
}

export default function ShiftCloseModal({
  isOpen,
  onClose,
  onConfirmClose,
  servedCount,
  pcEarnings,
  barEarnings,
  isShiftClosed,
}: ShiftCloseModalProps) {
  if (!isOpen) return null;

  const totalRevenue = pcEarnings + barEarnings;
  const cashAmount = Math.round(totalRevenue * 0.6);
  const cardAmount = totalRevenue - cashAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative glass-card w-full max-w-lg    p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Header */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-3 mb-4 shrink-0">
          <span className="font-heading text-base font-bold text-text-primary">
            {isShiftClosed ? "Smena Hisoboti" : "Smenani yakunlash"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="text-text-secondary hover:text-text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-full border border-border-glass/40 hover:border-accent-glow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!isShiftClosed ? (
            /* CONFIRMATION DISPLAY */
            <div className="space-y-4 text-center py-4">
              <div className="h-12 w-12 rounded-full bg-status-occupied/10 text-status-occupied flex items-center justify-center mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-heading text-base font-bold text-text-primary">
                  Smenani yopishni tasdiqlaysizmi?
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Smenani yopganingizdan so&apos;ng, tizim bugungi umumiy daromad hisobotini shakllantiradi va joriy admin seansini yakunlaydi.
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="p-3.5 bg-background-primary/40 border border-border-glass/20 rounded-2xl text-left text-xs max-w-sm mx-auto space-y-1">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Jami daromad (Hisob):</span>
                  <span className="font-bold text-text-primary">{totalRevenue.toLocaleString()} so&apos;m</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Xizmat ko&apos;rsatilgan mijozlar:</span>
                  <span className="font-bold text-text-primary">{servedCount} ta</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-background-primary border border-border-glass hover:border-accent-glow/50 text-text-secondary hover:text-text-primary transition-all duration-200 text-xs font-bold active:scale-95"
                >
                  Orqaga
                </button>
                <button
                  type="button"
                  onClick={onConfirmClose}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-status-occupied hover:bg-status-occupied/90 text-white font-bold transition-all duration-200 text-xs active:scale-95 shadow-lg shadow-status-occupied/10"
                >
                  Smenani Yopish
                </button>
              </div>
            </div>
          ) : (
            /* COMPLETED REPORT SUMMARY DISPLAY */
            <div className="space-y-5 py-2 text-left">
              {/* Success Badge Banner */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-status-free/20 bg-status-free/5">
                <CheckCircle className="h-6 w-6 text-status-free shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">Smena muvaffaqiyatli yopildi!</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Smena yopilish hisoboti muvaffaqiyatli shakllantirildi.</p>
                </div>
              </div>

              {/* Report Summary Card Details */}
              <div className="glass-card /40 bg-background-primary/45  p-4 space-y-4">
                <h5 className="font-heading text-xs font-bold text-accent-glow uppercase tracking-wider flex items-center gap-1.5 border-b border-border-glass/25 pb-2">
                  <Award className="h-4 w-4" />
                  Hisobot xulosasi
                </h5>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Yopilish vaqti:</span>
                    <span className="font-bold text-text-primary flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                      {new Date().toLocaleTimeString().slice(0, 5)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Jami mijozlar:</span>
                    <span className="font-bold text-text-primary">{servedCount} ta</span>
                  </div>
                </div>

                {/* Pricing summary splits */}
                <div className="space-y-2 border-t border-border-glass/20 pt-3 text-xs text-text-secondary">
                  <div className="flex justify-between items-center">
                    <span>Kompyuterlar daromadi:</span>
                    <span className="font-semibold text-text-primary">{pcEarnings.toLocaleString()} so&apos;m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bar / Oshxona daromadi:</span>
                    <span className="font-semibold text-text-primary">{barEarnings.toLocaleString()} so&apos;m</span>
                  </div>
                  
                  {/* Total row highlights */}
                  <div className="flex justify-between items-center border-t border-border-glass/10 pt-2 font-bold text-sm text-text-primary">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-4 w-4 text-accent-glow" />
                      Jami tushum:
                    </span>
                    <span className="text-accent-glow">{totalRevenue.toLocaleString()} so&apos;m</span>
                  </div>
                </div>

                {/* Cash vs Card highlights split */}
                <div className="border-t border-border-glass/25 pt-3 grid grid-cols-2 gap-2 text-[10px] text-text-secondary">
                  <div className="p-2 bg-background-secondary/60 rounded-xl text-left">
                    <span className="font-bold uppercase tracking-wider opacity-60">Naqd pul:</span>
                    <p className="font-heading font-bold text-text-primary text-xs mt-0.5">
                      {cashAmount.toLocaleString()} UZS
                    </p>
                  </div>
                  <div className="p-2 bg-background-secondary/60 rounded-xl text-left">
                    <span className="font-bold uppercase tracking-wider opacity-60">Karta / O&apos;tkazma:</span>
                    <p className="font-heading font-bold text-text-primary text-xs mt-0.5">
                      {cardAmount.toLocaleString()} UZS
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-2xl bg-accent-glow hover:bg-accent-glow/90 text-white font-bold transition-all duration-200 text-xs active:scale-95 shadow-lg shadow-accent-glow/15"
              >
                Yopish va Yakunlash
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
