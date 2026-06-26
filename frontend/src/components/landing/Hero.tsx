"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { IMAGE_PATHS } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, fadeIn, staggerContainerSlow } from "@/lib/animations";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { shouldAnimate } = useDesktopAnimation();

  const Container = shouldAnimate ? motion.div : "div";
  const Item = shouldAnimate ? motion.div : "div";
  const Heading = shouldAnimate ? motion.h1 : "h1";
  const Para = shouldAnimate ? motion.p : "p";
  const BtnGroup = shouldAnimate ? motion.div : "div";

  const containerProps = shouldAnimate
    ? { variants: staggerContainerSlow, initial: "hidden", animate: "visible" }
    : {};
  const itemProps = shouldAnimate ? { variants: fadeUp } : {};

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

      <Container
        {...containerProps}
        className={cn(
          "relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8 z-10",
          !shouldAnimate && "animate-in fade-in slide-in-from-bottom-8 duration-1000"
        )}
      >
        
        {/* Live Status Indicator */}
        <Item
          {...itemProps}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-primary bg-background-glass px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-status-online"></span>
          </span>
          <span className="font-mono text-xs font-medium text-text-primary tracking-wide sm:text-sm">
            4 JOY BO&apos;SH · 12:45 QOLDI
          </span>
        </Item>

        <Heading
          {...itemProps}
          className="font-heading max-w-4xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
        >
          O&apos;zbekistondagi barcha{" "}
          <span className="text-accent-primary drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">
            game club&apos;lar bir joyda
          </span>
        </Heading>

        <Para
          {...itemProps}
          className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Klub toping, joy band qiling — yoki o&apos;z klubingizni
          platformaga qo&apos;shing va boshqaruvni avtomatlashtiring.
        </Para>

        <BtnGroup
          {...itemProps}
          className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-accent-primary hover:bg-accent-glow hover:shadow-accent-glow transition-all active:scale-95 group">
            <Link href="/clublar">
              Klub topish
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-border-primary bg-transparent hover:bg-background-tertiary transition-all active:scale-95">
            <Link href="/royxatdan-otish/klub-egasi">Klubingizni qo&apos;shing</Link>
          </Button>
        </BtnGroup>
      </Container>
    </section>
  );
}
