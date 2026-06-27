"use client";

import React from "react";
import { X, Monitor, AlertCircle } from "lucide-react";
import { Computer } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

interface ChangePcModalProps {
  isOpen: boolean;
  onClose: () => void;
  computers: Computer[];
  currentComputer: Computer | null;
  onChangePc: (fromPcId: string, toPcId: string) => void;
}

export default function ChangePcModal({
  isOpen,
  onClose,
  computers,
  currentComputer,
  onChangePc,
}: ChangePcModalProps) {
  if (!isOpen || !currentComputer) return null;

  // Filter only other FREE computers
  const freeComputers = computers.filter(
    (pc) => pc.status === "free" && pc.id !== currentComputer.id
  );

  // Group by zone
  const zones: Record<Computer["zone"], Computer[]> = {
    Standard: [],
    VIP: [],
    PS5: [],
  };

  freeComputers.forEach((pc) => {
    zones[pc.zone].push(pc);
  });

  const handleSelect = (toPcId: string) => {
    onChangePc(currentComputer.id, toPcId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative glass-card w-full max-w-lg    p-6 shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
              PC o&apos;zgartirish (Change PC)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              PC {currentComputer.number} dagi seansni boshqa bo&apos;sh joyga ko&apos;chirish
            </p>
          </div>
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
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {freeComputers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-occupied/10 text-status-occupied">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h4 className="font-heading text-sm font-bold text-text-primary">
                Bo&apos;sh joylar mavjud emas
              </h4>
              <p className="mt-1 max-w-sm text-xs text-text-secondary">
                Klubda ko&apos;chirish uchun boshqa bo&apos;sh kompyuterlar topilmadi.
              </p>
            </div>
          ) : (
            (Object.keys(zones) as Computer["zone"][]).map((zoneName) => {
              const zonePcs = zones[zoneName];
              if (zonePcs.length === 0) return null;

              return (
                <div key={zoneName} className="space-y-2">
                  <h4 className="text-xs font-bold text-accent-glow uppercase tracking-wider">
                    {zoneName} Zona
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {zonePcs.map((pc) => (
                      <button
                        key={pc.id}
                        type="button"
                        onClick={() => handleSelect(pc.id)}
                        className="flex flex-col items-center justify-center p-2 rounded-2xl border border-border-glass bg-background-primary hover:border-accent-glow/65 hover:bg-accent-deep/10 text-text-primary active:scale-95 transition-all duration-200 aspect-square select-none group"
                      >
                        <Monitor className="h-4 w-4 mb-1 text-status-free group-hover:text-accent-glow transition-colors" />
                        <span className="text-[10px] font-bold font-heading">
                          PC {pc.number}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border-glass/40 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-full bg-background-primary border border-border-glass hover:border-accent-glow/50 text-text-secondary hover:text-text-primary transition-all duration-200 text-xs font-bold active:scale-95"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
}
