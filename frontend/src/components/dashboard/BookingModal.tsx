"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Calendar, Clock, AlertCircle, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (pc: string, zone: string, date: string, time: string, duration: string) => void;
  bookingDate: string;
  setBookingDate: Dispatch<SetStateAction<string>>;
  bookingTime: string;
  setBookingTime: Dispatch<SetStateAction<string>>;
}

const ZONES = [
  { id: "Standard", price: 10000, desc: "Professional GTX/RTX GPUlar, 240Hz monitor" },
  { id: "VIP", price: 18000, desc: "Alohida xona, RTX 4080, ultra-qulay kreslolar" },
  { id: "PS5", price: 25000, desc: "4K Katta ekran, PlayStation 5, 2x DualSense" },
];

interface MockPC {
  id: string;
  status: "free" | "occupied" | "ending_soon";
}

const MOCK_PCS: Record<string, MockPC[]> = {
  Standard: [
    { id: "1", status: "free" },
    { id: "2", status: "occupied" },
    { id: "3", status: "free" },
    { id: "4", status: "ending_soon" },
    { id: "5", status: "occupied" },
    { id: "6", status: "free" },
    { id: "7", status: "free" },
    { id: "8", status: "occupied" },
    { id: "9", status: "free" },
    { id: "10", status: "free" },
  ],
  VIP: [
    { id: "31", status: "free" },
    { id: "32", status: "occupied" },
    { id: "33", status: "ending_soon" },
    { id: "34", status: "free" },
    { id: "35", status: "occupied" },
  ],
  PS5: [
    { id: "41", status: "free" },
    { id: "42", status: "occupied" },
    { id: "43", status: "ending_soon" },
    { id: "44", status: "free" },
  ],
};

export function BookingModal({ 
  isOpen, 
  onClose, 
  onBook, 
  bookingDate, 
  setBookingDate, 
  bookingTime, 
  setBookingTime 
}: BookingModalProps) {
  const [mockFull, setMockFull] = useState(false);
  const [selectedZone, setSelectedZone] = useState("Standard");
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [customDuration, setCustomDuration] = useState("");
  const [selectedPc, setSelectedPc] = useState("");

  // Reset selected PC when zone changes
  useEffect(() => {
    setSelectedPc("");
  }, [selectedZone]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockFull) return;

    if (!selectedPc) {
      alert("Iltimos, o'yin kompyuterini tanlang.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      alert("Iltimos, sana va vaqtni to'g'ri tanlang.");
      return;
    }

    const duration = customDuration ? `${customDuration} soat` : `${selectedDuration} soat`;
    onBook(selectedPc, selectedZone, bookingDate, bookingTime, duration);
  };

  const getPrice = () => {
    const zone = ZONES.find((z) => z.id === selectedZone);
    const hourly = zone ? zone.price : 10000;
    const hours = parseInt(customDuration || selectedDuration) || 1; 
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
      <div className="relative glass-card w-full max-w-lg rounded-2xl border border-border-glass bg-background-secondary p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
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
            aria-label="Yopish"
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

              {/* Select Computer */}
              <div className="space-y-2">
                <Label>Kompyuterni tanlang</Label>
                <div className="grid grid-cols-5 gap-2">
                  {MOCK_PCS[selectedZone].map((pc) => {
                    const isOccupied = pc.status === "occupied";
                    const isEnding = pc.status === "ending_soon";
                    const isSelected = selectedPc === pc.id;

                    return (
                      <button
                        key={pc.id}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedPc(pc.id)}
                        aria-label={`Kompyuter ${pc.id}, holati: ${
                          isOccupied 
                            ? "band" 
                            : isEnding 
                            ? "yaqinda bo'shaydi" 
                            : "bo'sh"
                        }`}
                        className={cn(
                          "relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 aspect-square select-none",
                          isOccupied
                            ? "bg-background-secondary/20 border-border-glass/40 opacity-40 cursor-not-allowed text-text-secondary"
                            : isSelected
                            ? "border-accent-glow bg-accent-deep/30 text-text-primary shadow-accent-glow-sm scale-95"
                            : "border-border-glass bg-background-primary hover:border-accent-glow/50 text-text-primary active:scale-95"
                        )}
                      >
                        <Monitor className="h-4 w-4 mb-1" />
                        <span className="text-[10px] font-bold font-heading">PC {pc.id}</span>
                        
                        {isOccupied && (
                          <span className="absolute -top-1.5 -right-1 px-1 py-0.5 rounded bg-status-occupied text-[7px] font-bold text-white uppercase scale-90">
                            Band
                          </span>
                        )}
                        {isEnding && !isSelected && (
                          <span className="absolute -top-1.5 -right-1 px-1 py-0.5 rounded bg-status-ending text-[7px] font-bold text-white uppercase scale-90">
                            Band*
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!selectedPc && (
                  <p className="text-xs text-status-ending font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Iltimos, o&apos;yin kompyuterini tanlang.
                  </p>
                )}
              </div>

              {/* Date and Time Selection */}
              <div className="space-y-2">
                <Label>Qachon band qilish kerak?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   {/* Date Input */}
                   <div>
                     <Label htmlFor="booking-date" className="text-xs text-text-secondary mb-1 block">Sana</Label>
                     <div className="relative">
                       <Input
                         id="booking-date"
                         type="date"
                         className="pl-8"
                         value={bookingDate}
                         onChange={(e) => setBookingDate(e.target.value)}
                         required
                       />
                       <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                     </div>
                   </div>
                   {/* Time Input */}
                   <div>
                     <Label htmlFor="booking-time" className="text-xs text-text-secondary mb-1 block">Vaqt</Label>
                     <div className="relative">
                       <Input
                         id="booking-time"
                         type="time"
                         className="pl-8"
                         value={bookingTime}
                         onChange={(e) => setBookingTime(e.target.value)}
                         required
                       />
                       <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                     </div>
                   </div>
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <Label>Qancha vaqtga?</Label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {setSelectedDuration("1"); setCustomDuration("");}}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                      selectedDuration === "1" && !customDuration
                        ? "border-accent-glow bg-accent-primary text-white"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    }`}
                  >
                    1 soat
                  </button>
                  <button
                    type="button"
                    onClick={() => {setSelectedDuration("2"); setCustomDuration("");}}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                      selectedDuration === "2" && !customDuration
                        ? "border-accent-glow bg-accent-primary text-white"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    }`}
                  >
                    2 soat
                  </button>
                  <button
                    type="button"
                    onClick={() => {setSelectedDuration("3"); setCustomDuration("");}}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                      selectedDuration === "3" && !customDuration
                        ? "border-accent-glow bg-accent-primary text-white"
                        : "border-border-glass bg-background-primary text-text-secondary hover:border-accent-glow/50 hover:text-text-primary"
                    }`}
                  >
                    3 soat
                  </button>
                  <div className="col-span-1">
                      <Input
                        id="custom-duration"
                        type="number"
                        min="1"
                        max="8"
                        placeholder="Maxs."
                        value={customDuration}
                        onChange={(e) => {
                          setCustomDuration(e.target.value);
                          setSelectedDuration("");
                        }}
                        className="h-10 text-center"
                        required={!selectedDuration && !customDuration}
                      />
                    </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="rounded-xl bg-background-primary border border-border-glass/40 p-4 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-text-secondary">Umumiy to&apos;lov (Naqd):</span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-accent-glow">
                    {getPrice()}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
                  * To&apos;lov naqd pul shaklida kompyuter oldiga borilganda yoki administratorga amalga oshiriladi. Ushbu band qilingan vaqtda kompyuter siz uchun tayyor turadi.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1" disabled={!selectedPc}>
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
