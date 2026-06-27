"use client";

import { useState } from "react";
import { MonitorPlay, QrCode, MousePointerClick, Building2, Settings2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, fadeIn, staggerContainer, viewportOnceMore } from "@/lib/animations";

const STEPS_MIJOZ = [
  {
    id: "01",
    title: "Ro\u2018yxatdan o\u2018t",
    description: "Platformada o\u2018z profilingizni yarating.",
    icon: MousePointerClick,
  },
  {
    id: "02",
    title: "Klubni top",
    description: "Yaqin atrofdagi klublarni qidiring va o\u2018zingizga qulayini tanlang.",
    icon: QrCode,
  },
  {
    id: "03",
    title: "Joy band qil",
    description: "Joy band qiling yoki klubga kelib QR kod orqali buyurtma bering.",
    icon: MonitorPlay,
  },
];

const STEPS_KLUB = [
  {
    id: "01",
    title: "Klubni ro\u2018yxatdan o\u2018tkaz",
    description: "Klubingiz haqida to\u2018liq ma\u2018lumotlarni kiriting va profil yarating.",
    icon: Building2,
  },
  {
    id: "02",
    title: "Tizimni sozla",
    description: "Kompyuter zonalarini, narxlarni va bar menyusini sozlang.",
    icon: Settings2,
  },
  {
    id: "03",
    title: "Avtomatik boshqar",
    description: "Buyurtmalar va hisobotlarni onlayn kuzatib boring. Hammasi avtomatik ishlaydi.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"mijoz" | "klub">("mijoz");
  const { shouldAnimate } = useDesktopAnimation();
  
  const steps = activeTab === "mijoz" ? STEPS_MIJOZ : STEPS_KLUB;

  const SectionHeader = shouldAnimate ? motion.div : "div";
  const headerProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnceMore }
    : {};

  const Grid = shouldAnimate ? motion.div : "div";
  const gridProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnceMore }
    : {};

  const Card = shouldAnimate ? motion.div : "div";
  const cardProps = shouldAnimate ? { variants: fadeUp } : {};

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-background-primary md:bg-transparent overflow-hidden">
      {/* Decorative gradient element */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader {...headerProps} className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl mb-6">
            <span className="gradient-text">Qanday ishlaydi?</span>
          </h2>
          
          <div className="inline-flex rounded-3xl bg-background-secondary p-1 border border-border-primary mx-auto mb-6">
            <button
              onClick={() => setActiveTab("mijoz")}
              className={`px-6 py-2 rounded-3xl text-sm font-bold transition-all ${
                activeTab === "mijoz" ? "bg-accent-primary text-white shadow-md" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Mijozlar uchun
            </button>
            <button
              onClick={() => setActiveTab("klub")}
              className={`px-6 py-2 rounded-3xl text-sm font-bold transition-all ${
                activeTab === "klub" ? "bg-accent-primary text-white shadow-md" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Klub egalari uchun
            </button>
          </div>
          
          <p className="mt-4 text-base text-text-secondary h-12">
            {activeTab === "mijoz" 
              ? "CClub orqali o\u2018z joyingizni band qilish juda oson. 3 ta oddiy qadam bilan o\u2018yinga tayyor bo\u2018ling."
              : "Platformaga qo\u2018shiling va biznesingizni avtomatlashtiring."}
          </p>
        </SectionHeader>

        {shouldAnimate ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="relative grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12"
            >
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border-primary to-transparent -translate-y-1/2" />

              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div key={step.id} variants={fadeUp} className="relative group">
                    <div className="flex flex-col items-center text-center p-6 glass-card hover:border-accent-primary/50 transition-colors duration-300 relative z-10 hover:shadow-card-hover hover:-translate-y-1">
                      
                      {/* Step Label */}
                      <div className="absolute -top-4 section-badge">
                        {step.id}
                      </div>

                      <div className="mt-6 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8" />
                      </div>
                      
                      <h3 className="mb-3 font-heading text-xl font-semibold text-text-primary">
                        {step.title}
                      </h3>
                      
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12" key={activeTab}>
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border-primary to-transparent -translate-y-1/2" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex flex-col items-center text-center p-6 glass-card hover:border-accent-primary/50 transition-colors duration-300 relative z-10 hover:shadow-card-hover hover:-translate-y-1">
                    
                    <div className="absolute -top-4 section-badge">
                      {step.id}
                    </div>

                    <div className="mt-6 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <h3 className="mb-3 font-heading text-xl font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
