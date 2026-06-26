"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/shared/Logo";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function RegisterPage() {
  const { isDesktop } = useDesktopAnimation();

  useEffect(() => {
    document.title = "Ro'yxatdan o'tish — cclub";
  }, []);

  return (
    <main className="relative min-h-screen bg-background-primary md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center sm:justify-start">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-12 py-10">
          {/* Left Column - Branding (Desktop only) */}
          <div className="hidden md:flex flex-col flex-1 max-w-lg space-y-6">
            <div className="section-badge self-start">CClub Ro'yxatdan o'tish</div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
              <span className="gradient-text">Oson ro&apos;yxatdan o&apos;ting va o&apos;ynang</span>
            </h1>
            <p className="text-text-secondary text-base lg:text-lg">
              Hisobingizni oching va eng yaqin o&apos;yin klublarida VIP joylarni band qiling. Foydali takliflar va bonuslardan foydalaning.
            </p>
            <div className="flex flex-col gap-4 border-l border-indigo-500/20 pl-6 mt-4">
              <div>
                <span className="font-bold text-white text-sm block">Premium hamjamiyat</span>
                <span className="text-text-secondary text-xs">Minglab geymerlar bilan birga bo&apos;ling</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Bonuslar va turnirlar</span>
                <span className="text-text-secondary text-xs">Doimiy aksiyalar va musobaqalarda qatnashing</span>
              </div>
            </div>
          </div>

          {/* Right Column - RegisterForm */}
          <div className="flex flex-1 justify-center w-full max-w-md">
            <RegisterForm />
          </div>
        </div>

        <p className="text-center text-xs text-text-secondary">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-accent-glow"
          >
            &larr; Bosh sahifaga qaytish
          </Link>
        </p>
      </div>
    </main>
  );
}
