"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";
import { motion } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function LoginPage() {
  const { shouldAnimate, isDesktop } = useDesktopAnimation();

  useEffect(() => {
    document.title = "Kirish — cclub";
  }, []);

  const BackgroundWrapper = shouldAnimate ? motion.div : "div";

  return (
    <main className="relative min-h-screen bg-background-primary md:bg-transparent md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      {/* Animated gradient on desktop */}
      <BackgroundWrapper
        {...(shouldAnimate ? {
          variants: fadeIn,
          initial: "hidden",
          animate: "visible"
        } : {})}
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
            <div className="section-badge self-start">CClub Portal</div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
              <span className="gradient-text">O&apos;yinga tezkor kirish va boshqaruv</span>
            </h1>
            <p className="text-text-secondary text-base lg:text-lg">
              Klublardagi joyingizni oldindan band qiling, bar menyusidan buyurtma bering va hisobingizni to&apos;ldiring. Hammasi bir joyda.
            </p>
            <div className="flex flex-col gap-4 border-l border-indigo-500/20 pl-6 mt-4">
              <div>
                <span className="font-bold text-white text-sm block">Tezkor bron</span>
                <span className="text-text-secondary text-xs">2 daqiqada sevimli kompyuteringizni band qiling</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Bar menyusi</span>
                <span className="text-text-secondary text-xs">O&apos;yin davomida bar va oshxonadan buyurtma bering</span>
              </div>
            </div>
          </div>

          {/* Right Column - LoginForm */}
          <div className="flex flex-1 justify-center w-full max-w-md">
            <Suspense fallback={
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-glow/20 border-t-accent-glow" />
                <p className="text-xs text-text-secondary">Yuklanmoqda...</p>
              </div>
            }>
              <LoginForm />
            </Suspense>
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
