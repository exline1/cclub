"use client";

import { Clock, Crown, Gamepad2, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, staggerContainer, cardHover, viewportOnce } from "@/lib/animations";

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Zap,
    title: "Tezkor buyurtma",
    description:
      "Bir necha bosqichda kompyuter yoki zonani band qiling — navbatda kutish yo\u2018q.",
  },
  {
    icon: Clock,
    title: "Onlayn vaqt nazorati",
    description:
      "Qolgan vaqtni real vaqtda kuzating va o\u2018z sessiyangizni oson boshqaring.",
  },
  {
    icon: Crown,
    title: "VIP zonalar",
    description:
      "Premium jihozlar, qulay o\u2018rindiqlar va alohida atmosfera — eng yaxshi tajriba uchun.",
  },
  {
    icon: Gamepad2,
    title: "PS5 xonasi",
    description:
      "Konsol o\u2018yinchilari uchun maxsus xona — eng so\u2018nggi o\u2018yinlar va 4K displey.",
  },
];

export function Services() {
  const { shouldAnimate } = useDesktopAnimation();

  const Header = shouldAnimate ? motion.div : "div";
  const headerProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Grid = shouldAnimate ? motion.div : "div";
  const gridProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header {...headerProps} className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-glow sm:text-sm">
            Imkoniyatlar
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Nima uchun cclub?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
            O&apos;yin klubingiz uchun kerakli barcha xizmatlar — bitta zamonaviy platformada.
          </p>
        </Header>

        <Grid {...gridProps} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} service={service} shouldAnimate={shouldAnimate} />
          ))}
        </Grid>
      </div>
    </section>
  );
}

function ServiceCard({ service, shouldAnimate }: { service: ServiceItem; shouldAnimate: boolean }) {
  const Icon = service.icon;

  const Wrapper = shouldAnimate ? motion.div : "div";
  const wrapperProps = shouldAnimate
    ? { variants: fadeUp, whileHover: cardHover }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <Card className="transition-all duration-200 hover:border-accent-glow hover:shadow-accent-glow-sm h-full">
        <CardHeader className="pb-3">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-deep text-accent-glow">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-lg">{service.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {service.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
