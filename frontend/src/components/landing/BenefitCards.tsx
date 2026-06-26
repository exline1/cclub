"use client";

import { Search, CalendarCheck, BarChart, Settings, HandCoins, MonitorPlay } from "lucide-react";
import { motion } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, staggerContainer, cardHover, viewportOnce } from "@/lib/animations";

const BENEFITS = [
  {
    icon: Search,
    title: "Bir joyda hamma klub",
    description: "Sizning hududingizdagi eng yaxshi va mos klublarni tez qidirib toping.",
  },
  {
    icon: CalendarCheck,
    title: "Onlayn joy band qilish",
    description: "Uydan chiqmasdan bo\u2018sh kompyuter yoki VIP xonani o\u2018zingizga qulay vaqtga band qiling.",
  },
  {
    icon: HandCoins,
    title: "Narxlarni solishtirish",
    description: "Turli klublardagi narxlar va sharoitlarni osongina taqqoslab, to\u2018g\u2018ri qaror qabul qiling.",
  },
  {
    icon: Settings,
    title: "Avtomatik boshqaruv",
    description: "Klub egalari uchun kompyuterlar, zonalar va band qilishlarni yagona interfeysdan boshqarish.",
  },
  {
    icon: BarChart,
    title: "Real-time hisobot",
    description: "Sotuvlar, mijozlar oqimi va tushumlarni aniq statistika yordamida kuzatib boring.",
  },
  {
    icon: MonitorPlay,
    title: "Kamroq ish, ko\u2018proq daromad",
    description: "Adminstrator yuklamasini kamaytirib, xatoliklarsiz uzluksiz biznes jarayonini ta\u2018minlang.",
  },
];

export function BenefitCards() {
  const { shouldAnimate } = useDesktopAnimation();

  const Grid = shouldAnimate ? motion.div : "div";
  const gridProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Header = shouldAnimate ? motion.div : "div";
  const headerProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Card = shouldAnimate ? motion.div : "div";

  return (
    <section id="benefits" className="py-20 lg:py-28 bg-background-secondary relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header {...headerProps} className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-primary mb-3">
            Afzalliklar
          </p>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Nima uchun CClub?
          </h2>
        </Header>

        <Grid {...gridProps} className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            const cardMotionProps = shouldAnimate
              ? { variants: fadeUp, whileHover: cardHover }
              : {};

            return (
              <Card 
                key={benefit.title} 
                {...cardMotionProps}
                className={`group relative flex flex-col p-8 rounded-[20px] bg-background-primary border border-border-primary hover:border-accent-primary transition-all duration-300 hover:shadow-card-hover ${
                  !shouldAnimate ? "animate-in fade-in slide-in-from-bottom-8 fill-mode-both" : ""
                }`}
                style={!shouldAnimate ? { animationDelay: `${index * 150}ms` } : undefined}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-deep text-accent-primary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed flex-grow">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </Grid>
      </div>
    </section>
  );
}
