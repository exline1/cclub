"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/auth/FormField";
import { toast } from "sonner";

interface TelegramOTPProps {
  onVerified: (phone: string) => void;
}

export function TelegramOTP({ onVerified }: TelegramOTPProps) {
  const [step, setStep] = useState<"init" | "phone" | "otp">("init");
  const [phone, setPhone] = useState("+998");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendCode = async () => {
    const cleanPhone = phone.replace(/[\s()-]/g, "");
    if (cleanPhone.length < 9) {
      toast.error("Iltimos, telefon raqamini to'liq kiriting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-telegram-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kod yuborishda xatolik.");
      }

      toast.success("Tasdiqlash kodi yuborildi!");
      setStep("otp");
      setCooldown(60);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Kodni to'liq kiriting.");
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/[\s()-]/g, "");
      const res = await fetch("http://localhost:5000/api/auth/verify-telegram-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kod noto'g'ri.");
      }

      toast.success("Telefon raqami muvaffaqiyatli tasdiqlandi!");
      onVerified(cleanPhone);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border-glass mt-2">
      <div className="text-center">
        <h3 className="text-sm font-bold text-white">Telefon raqamni tasdiqlash</h3>
      </div>

      {step === "init" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-text-secondary text-center">
            Tasdiqlash kodini olish uchun avval Telegram botimizga ulaning va raqamingizni ulashing.
          </p>
          <a
            href="https://t.me/cclub_otp_bot" // Almashtirish kerak
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2AABEE] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#229ED9]"
          >
            Telegram botni ochish
          </a>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs"
            onClick={() => setStep("phone")}
          >
            Botni ishga tushirdim, davom etish
          </Button>
        </div>
      )}

      {step === "phone" && (
        <div className="space-y-3">
          <FormField id="tg-phone" label="Telefon raqam (+998 formatda)">
            <Input
              id="tg-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
            />
          </FormField>
          <Button
            type="button"
            className="w-full"
            onClick={handleSendCode}
            disabled={loading || cooldown > 0}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : cooldown > 0 ? `Qayta yuborish (${cooldown}s)` : "Kod yuborish"}
          </Button>
          <button
            type="button"
            className="w-full text-xs text-text-secondary hover:text-white mt-1"
            onClick={() => setStep("init")}
          >
            Ortga qaytish
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <p className="text-xs text-center text-text-secondary">
            {phone} raqamining Telegram manziliga 6 xonali kod yuborildi.
          </p>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-10 h-12 text-center text-lg font-bold p-0"
              />
            ))}
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleVerifyCode}
            disabled={loading || otp.join("").length < 6}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Tasdiqlash"}
          </Button>

          <div className="flex justify-between items-center text-xs">
            <button
              type="button"
              className="text-text-secondary hover:text-white"
              onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
            >
              Raqamni o'zgartirish
            </button>
            <button
              type="button"
              className={cooldown > 0 ? "text-text-secondary cursor-not-allowed" : "text-accent-glow hover:text-accent-primary font-semibold"}
              onClick={cooldown > 0 ? undefined : handleSendCode}
              disabled={cooldown > 0 || loading}
            >
              {cooldown > 0 ? `Qayta yuborish (${cooldown}s)` : "Kodni qayta yuborish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
