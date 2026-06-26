"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, slideInRight, scaleIn, viewportOnce } from "@/lib/animations";

export function DownloadCTA() {
  const { shouldAnimate } = useDesktopAnimation();

  const Section = shouldAnimate ? motion.div : "div";
  const sectionProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Mockup = shouldAnimate ? motion.div : "div";
  const mockupProps = shouldAnimate
    ? { variants: slideInRight, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-cta-gradient" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Section
          {...sectionProps}
          className="bg-background-tertiary border border-border-primary rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
        >
          
          {/* Decorative glow inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl mb-6">
              Biznesingizni yangi <br className="hidden md:block" /> bosqichga olib chiqing
            </h2>
            <p className="text-base text-text-secondary mb-8 max-w-xl">
              Platformamizga ulanish orqali jarayonlarni avtomatlashtiring, xarajatlarni kamaytiring va mijozlar bazangizni kengaytiring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="h-14 px-8 bg-accent-primary hover:bg-accent-glow text-white rounded-xl shadow-accent-glow-sm transition-transform active:scale-95 group">
                <Link href="/royxatdan-otish/klub-egasi" className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  Klubingizni hoziroq qo&apos;shing
                </Link>
              </Button>
            </div>
          </div>
          
          <Mockup
            {...mockupProps}
            className="flex-1 hidden lg:flex justify-center z-10"
          >
            {/* Mockup dashboard representation */}
            <div className="relative w-72 h-[450px] bg-background-primary rounded-xl border border-border-primary shadow-accent-glow flex flex-col overflow-hidden rotate-2 hover:rotate-0 transition-all duration-700">
              <div className="h-12 border-b border-border-primary flex items-center px-4 bg-background-secondary">
                 <div className="flex gap-1.5">
                   <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                   <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                   <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                 </div>
              </div>
              <div className="flex-1 bg-card-gradient flex flex-col items-center justify-center p-6">
                 <div className="font-heading text-2xl font-bold text-accent-primary mb-4">CClub Admin</div>
                 <div className="w-full space-y-4">
                   <div className="h-20 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                   <div className="h-20 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                   <div className="h-20 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                 </div>
              </div>
            </div>
          </Mockup>
        </Section>
      </div>
    </section>
  );
}
