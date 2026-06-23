import { Clock, Gamepad2, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: Zap,
    title: "Tezkor buyurtma",
    description:
      "Bir necha bosqichda kompyuter yoki zonani band qiling — navbatda kutish va ortiqcha muammolarsiz.",
  },
  {
    icon: Clock,
    title: "Vaqt nazorati",
    description:
      "Qolgan vaqtni real vaqtda kuzating, hisobingizni to'ldiring va sessiyangizni bevosita ilovadan boshqaring.",
  },
  {
    icon: Gamepad2,
    title: "Premium zonalar",
    description:
      "Eng so'nggi jihozlar, qulay o'rindiqlar va yuqori darajadagi PS5 xonalari — maksimal zavq uchun.",
  },
];

export function BenefitCards() {
  return (
    <section id="benefits" className="py-20 lg:py-28 bg-background-secondary relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary mb-3">
            Afzalliklar
          </p>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Nima uchun CClub?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.title} 
                className="group relative flex flex-col p-8 rounded-[20px] bg-background-primary border border-border-primary hover:border-accent-primary hover:-translate-y-2 transition-all duration-300 hover:shadow-card-hover animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-deep text-accent-secondary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed flex-grow">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
