"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { IMAGE_PATHS } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-16 flex items-center justify-center">
      {/* Fallback gradient background */}
      <div 
        className="absolute inset-0 bg-hero-gradient transition-opacity duration-700" 
        aria-hidden="true" 
      />

      {/* Background image with fade-in effect */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-in-out",
          imageLoaded ? "opacity-30" : "opacity-0"
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

      {/* Dark overlay to ensure contrast */}
      <div
        className="absolute inset-0 bg-background-primary/80"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8 z-10">
        {/* Logo and Brand in Hero */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <Logo showText={false} className="h-12 w-12 sm:h-14 sm:w-14" />
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent-glow sm:text-sm mt-2">
            cclub
          </span>
        </div>

        <h1 className="font-heading max-w-4xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          O&apos;yinga sho&apos;ng&apos;i,{" "}
          <span className="text-accent-glow">qolganini bizga qo&apos;y</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base lg:text-lg">
          cclub — kompyuter o&apos;yinlari markazlari uchun tezkor buyurtma,
          onlayn vaqt nazorati va premium o&apos;yin zonalari bitta platformada.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto active:scale-95 transition-transform duration-150">
            <Link href="/login">Kirish</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto active:scale-95 transition-transform duration-150">
            <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
