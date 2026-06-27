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
    <div className="min-h-screen bg-background-primary md:bg-transparent flex flex-col relative md:bg-stripe-gradient">
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
        <div className="w-full max-w-md bg-background-secondary border border-border-primary rounded-50px p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Mijoz sifatida qo'shiling</h1>
            <p className="text-sm text-text-secondary">Shaxsiy ma'lumotlaringizni kiriting.</p>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                // alert("Google orqali muvaffaqiyatli kirdingiz!");
              }, 1500);
            }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border border-gray-200"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Google bilan davom etish
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-border-primary flex-1"></div>
            <span className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Yoki elektron pochta orqali</span>
            <div className="h-px bg-border-primary flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Ism <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="Ali" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Familiya <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="Valiyev" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Telefon raqam <span className="text-status-occupied">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">+998</span>
                <input required type="tel" className="w-full bg-background-tertiary border border-border-primary rounded-2xl pl-14 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="(90) 123-45-67" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Email (ixtiyoriy)</label>
              <input type="email" className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="ali@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Parol <span className="text-status-occupied">*</span></label>
              <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="••••••••" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Parolni tasdiqlang <span className="text-status-occupied">*</span></label>
              <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-secondary/50" placeholder="••••••••" />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input required id="terms" type="checkbox" className="h-4 w-4 rounded border-border-primary bg-background-tertiary text-accent-primary focus:ring-accent-primary focus:ring-offset-background-primary" />
              </div>
              <label htmlFor="terms" className="text-sm text-text-secondary leading-tight cursor-pointer">
                Men <Link href="#" className="text-accent-primary hover:underline">Foydalanish shartlari</Link> va maxfiylik siyosatiga roziman.
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-accent-primary hover:bg-accent-glow text-white text-base font-semibold  transition-all">
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
