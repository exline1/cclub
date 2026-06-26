"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function ClientRegistrationPage() {
  const { isDesktop } = useDesktopAnimation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col relative md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      <header className="p-6 flex items-center justify-between border-b border-border-primary/50 bg-background-primary/80 backdrop-blur-md sticky top-0 z-50">
        <Logo />
        <Link 
          href="/royxatdan-otish" 
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-background-secondary border border-border-primary rounded-[24px] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Mijoz sifatida qo'shiling</h1>
            <p className="text-sm text-text-secondary">Shaxsiy ma'lumotlaringizni kiriting.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Ism <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="Ali" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Familiya <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="Valiyev" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Telefon raqam <span className="text-status-occupied">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">+998</span>
                <input required type="tel" className="w-full bg-background-tertiary border border-border-primary rounded-xl pl-14 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="(90) 123-45-67" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Email (ixtiyoriy)</label>
              <input type="email" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="ali@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Parol <span className="text-status-occupied">*</span></label>
              <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="••••••••" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Parolni tasdiqlang <span className="text-status-occupied">*</span></label>
              <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="••••••••" />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input required id="terms" type="checkbox" className="h-4 w-4 rounded border-border-primary bg-background-tertiary text-accent-primary focus:ring-accent-primary focus:ring-offset-background-primary" />
              </div>
              <label htmlFor="terms" className="text-sm text-text-secondary leading-tight cursor-pointer">
                Men <Link href="#" className="text-accent-primary hover:underline">Foydalanish shartlari</Link> va maxfiylik siyosatiga roziman.
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-accent-primary hover:bg-accent-glow text-white text-base font-semibold rounded-xl transition-all">
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Yuborilmoqda...</>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-text-secondary border-t border-border-primary pt-6">
            Allaqachon akkauntingiz bormi?{" "}
            <Link href="/login" className="text-accent-primary font-semibold hover:text-accent-glow hover:underline">
              Tizimga kirish
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
