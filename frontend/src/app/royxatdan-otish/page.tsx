"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { User, Building2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import dynamic from "next/dynamic";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function RegisterChoicePage() {
  const { isDesktop } = useDesktopAnimation();
  return (
    <div className="min-h-screen bg-background-primary md:bg-transparent flex flex-col relative overflow-hidden md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between relative z-10">
        <Logo />
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifaga qaytish
        </Link>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Xush kelibsiz!
            </h1>
            <p className="text-lg text-text-secondary">
              CClub platformasida ro'yxatdan o'tish uchun profilingiz turini tanlang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Client Card */}
            <Link 
              href="/royxatdan-otish/mijoz"
              className="group relative flex flex-col items-center text-center p-10 rounded-50px bg-background-secondary border-2 border-border-primary hover:border-accent-primary hover:-translate-y-2 transition-all duration-300 hover:shadow-accent-glow-sm animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: "100ms" }}
            >
              <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                <User className="h-10 w-10" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Mijoz sifatida
              </h2>
              <p className="text-text-secondary">
                Klublarni topish, joy band qilish, balansni boshqarish va o'yin sessiyalarini kuzatish uchun.
              </p>
            </Link>

            {/* Club Owner Card */}
            <Link 
              href="/royxatdan-otish/klub-egasi"
              className="group relative flex flex-col items-center text-center p-10 rounded-50px bg-background-secondary border-2 border-border-primary hover:border-accent-secondary hover:-translate-y-2 transition-all duration-300 hover:shadow-accent-glow-sm animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: "200ms" }}
            >
              <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-accent-secondary/10 text-accent-secondary group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-10 w-10" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">
                Klub egasi sifatida
              </h2>
              <p className="text-text-secondary">
                Klubingizni platformaga qo'shish, boshqarish, va mijozlarga o'z xizmatlaringizni taklif qilish uchun.
              </p>
            </Link>
          </div>
          
          <div className="mt-12 text-center text-sm text-text-secondary animate-in fade-in duration-700" style={{ animationDelay: "400ms" }}>
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
