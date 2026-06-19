"use client";

import { useState } from "react";
import { AlertCircle, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (pc: string, zone: string, duration: string) => void;
}

const ZONES = [
  { id: "Standard", price: 10000, desc: "Professional GTX/RTX GPUlar, 240Hz monitor" },
  { id: "VIP", price: 18000, desc: "Alohida xona, RTX 4080, ultra-qulay kreslolar" },
  { id: "PS5", price: 25000, desc: "4K Katta ekran, PlayStation 5, 2x DualSense" },
];

const TIME_PRESETS = ["1 soat", "2 soat", "3 soat", "Boshqa"];

export function BookingModal({ isOpen, onClose, onBook }: BookingModalProps) {
  const [mockFull, setMockFull] = useState(false);
  const [selectedZone, setSelectedZone] = useState("Standard");
  const [selectedTime, setSelectedTime] = useState("1 soat");
  const [customTime, setCustomTime] = useState("");
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockFull) return;

    const duration = selectedTime === "Boshqa" ? `${customTime || 1} soat` : selectedTime;
    // Generate a random mock PC number
    const pcNum = selectedZone === "VIP" 
      ? Math.floor(Math.random() * 5) + 31 // VIP PC numbers 31-35
      : selectedZone === "PS5"
      ? Math.floor(Math.random() * 4) + 41 // PS5 numbers 41-44
      : Math.floor(Math.random() * 20) + 1; // Standard numbers 1-20

    onBook(pcNum.toString(), selectedZone, duration);
  };

  const getPrice = () => {
    const zone = ZONES.find((z) => z.id === selectedZone);
    const hourly = zone ? zone.price : 10000;
    const hours = selectedTime === "Boshqa" ? parseInt(customTime) || 1 : parseInt(selectedTime) || 1;
    return (hourly * hours).toLocaleString() + " so'm";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative glass-card w-full max-w-lg rounded-2xl border border-border-glass bg-background-secondary p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Top Control Header for Mock State */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-bold text-text-primary">Joy band qilish</span>
            <label className="inline-flex items-center cursor-pointer ml-3 bg-background-primary px-2 py-0.5 rounded border border-border-glass text-[10px] text-text-secondary hover:text-text-primary select-none">
              <input 
                type="checkbox" 
                checked={mockFull} 
                onChange={(e) => setMockFull(e.target.checked)} 
                className="mr-1"
              />
              Mock: Hamma joy band
            </label>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-lg border border-border-glass/40 hover:border-accent-glow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {mockFull ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-occupied/10 text-status-occupied">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary">Hozircha bo&apos;sh joy yo&apos;q</h3>
              <p className="mt-2 max-w-sm text-sm text-text-secondary">
                Klubdagi barcha o&apos;yin o&apos;rinlari hozirda band. Iltimos birozdan keyin qayta urunib ko&apos;ring yoki administrator bilan bog&apos;laning.
              </p>
              <Button onClick={onClose} className="mt-6" variant="secondary">
                Yopish
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Select Zone */}
              <div className="space-y-2">
                <Label>Zonani tanlang</Label>
                <div className="grid grid-cols-1 gap-2.5">
                  {ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone.id)}
                      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        selectedZone === zone.id
                          ? "border-accent-glow bg-accent-deep/20 shadow-accent-glow-sm"
                          : "border-border-glass bg-background-primary hover:border-accent-glow/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-heading font-bold text-sm text-text-primary sm:text-base">
                          {zone.id} zona
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-accent-glow">
                          {zone.price.toLocaleString()} so&apos;m/soat
                        </span>
                      </div>
                      <span className="text-xs text-text-secondary mt-1">{zone.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Presets */}
              <div className="space-y-2">
                <Label>Vaqtni belgilang</Label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedTime(preset);
                        if (preset !== "Boshqa") setCustomTime("");
                      }}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                        selectedTime === preset
                          ? "border-accent-glow bg-accent-primary text-white"
                          : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Time Input */}
              {selectedTime === "Boshqa" && (
                <div className="space-y-2 animate-accordion-down">
                  <Label htmlFor="custom-hours">Soatlar soni</Label>
                  <Input
                    id="custom-hours"
                    type="number"
                    min="1"
                    max="24"
                    placeholder="Masalan: 5"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Pricing Summary */}
              <div className="rounded-xl bg-background-primary border border-border-glass/40 p-4 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-text-secondary">Umumiy to&apos;lov (Naqd):</span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-accent-glow">
                    {getPrice()}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
                  * To&apos;lov naqd pul shaklida kompyuter oldiga borilganda yoki administratorga amalga oshiriladi.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1">
                  Band qilish
                </Button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
