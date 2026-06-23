"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { IMAGE_PATHS } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative min-h-[90svh] overflow-hidden pt-16 flex items-center justify-center">
      {/* Ambient glow background */}
      <div 
        className="absolute inset-0 bg-hero-gradient" 
        aria-hidden="true" 
      />

      {/* Background image with fade-in effect */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in-out mix-blend-overlay",
          imageLoaded ? "opacity-20" : "opacity-0"
        )}
      >
        <Image
          src={IMAGE_PATHS.heroBg}
          alt="Zamonaviy gaming klub interyeri"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Live Status Indicator */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-primary bg-background-glass px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-status-online"></span>
          </span>
          <span className="font-mono text-xs font-medium text-text-primary tracking-wide sm:text-sm">
            4 JOY BO'SH · 12:45 QOLDI
          </span>
        </div>

        <h1 className="font-heading max-w-4xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          O&apos;yinga sho&apos;ng&apos;i,{" "}
          <span className="text-accent-secondary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            qolganini bizga qo&apos;y
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          cClub — kompyuter o&apos;yinlari markazlari uchun tezkor buyurtma,
          onlayn vaqt nazorati va premium o&apos;yin zonalari bitta platformada.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-accent-primary hover:bg-accent-glow hover:shadow-accent-glow transition-all active:scale-95 group">
            <Link href="#pricing">
              Joy band qilish
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-border-primary bg-transparent hover:bg-background-tertiary transition-all active:scale-95">
            <Link href="#how-it-works">Qanday ishlaydi?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
