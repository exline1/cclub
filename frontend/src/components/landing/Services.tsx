import { Clock, Crown, Gamepad2, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      "Bir necha bosqichda kompyuter yoki zonani band qiling — navbatda kutish yo'q.",
  },
  {
    icon: Clock,
    title: "Onlayn vaqt nazorati",
    description:
      "Qolgan vaqtni real vaqtda kuzating va o'z sessiyangizni oson boshqaring.",
  },
  {
    icon: Crown,
    title: "VIP zonalar",
    description:
      "Premium jihozlar, qulay o'rindiqlar va alohida atmosfera — eng yaxshi tajriba uchun.",
  },
  {
    icon: Gamepad2,
    title: "PS5 xonasi",
    description:
      "Konsol o'yinchilari uchun maxsus xona — eng so'nggi o'yinlar va 4K displey.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-glow sm:text-sm">
            Imkoniyatlar
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Nima uchun GameClub Hub?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
            O&apos;yin klubingiz uchun kerakli barcha xizmatlar — bitta zamonaviy platformada.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = service.icon;

  return (
    <Card className="transition-all duration-200 hover:border-accent-glow hover:shadow-accent-glow-sm">
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
  );
}
