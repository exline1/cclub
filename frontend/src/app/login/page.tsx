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
  const { shouldAnimate } = useDesktopAnimation();

  useEffect(() => {
    document.title = "Kirish — cclub";
  }, []);

  const BackgroundWrapper = shouldAnimate ? motion.div : "div";

  return (
    <main className="relative min-h-screen bg-background-primary">
      <Suspense fallback={null}>
        <SceneWrapper variant="minimal" />
      </Suspense>
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

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center sm:justify-start">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center pb-8">
          <Suspense fallback={
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-glow/20 border-t-accent-glow" />
              <p className="text-xs text-text-secondary">Yuklanmoqda...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
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
