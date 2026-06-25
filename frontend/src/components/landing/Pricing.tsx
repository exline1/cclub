import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Bepul",
    price: "0",
    duration: "so'm / oy",
    description: "Katalogga kirish va asosiy profil yaratish uchun qulay boshlang'ich nuqta.",
    features: [
      "Katalogga qo'shilish",
      "Asosiy klub profili",
      "Mijozlardan sharhlar qabul qilish",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "499,000",
    duration: "so'm / oy",
    description: "Klubni to'liq boshqarish va daromadni oshirish uchun ideal yechim.",
    features: [
      "Boshqaruv tizimi (kompyuter + bar)",
      "Real-time hisobot va statistika",
      "Mijozlarni onlayn joy band qilishi",
      "24/7 texnik yordam",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Kelishuv",
    duration: "asosida",
    description: "Katta tarmoqlar va qo'shimcha imkoniyatlarga muhtoj klublar uchun.",
    features: [
      "Ko'p filiallarni boshqarish",
      "API integratsiyasi",
      "Shaxsiy menejer",
      "Maxsus funksional qo'shish",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-background-primary relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-primary mb-3">
            Tariflar
          </p>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Klub egalari uchun tarif rejalari
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-text-secondary">
            Klubingizni platformaga ulash va avtomatlashtirish uchun o'zingizga mos tarifni tanlang.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8 items-center">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "relative flex flex-col p-8 rounded-[24px] transition-all duration-300",
                plan.recommended 
                  ? "bg-background-tertiary border-2 border-accent-primary shadow-accent-glow transform md:-translate-y-4" 
                  : "bg-background-secondary border border-border-primary hover:border-accent-primary/50"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                  Tavsiya etiladi
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">{plan.name}</h3>
                <p className="text-sm text-text-secondary">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-sm text-text-secondary">{plan.duration}</span>
              </div>

              <ul className="mb-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent-primary shrink-0" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild
                variant={plan.recommended ? "default" : "outline"} 
                className={cn(
                  "w-full h-12 rounded-xl transition-all",
                  plan.recommended 
                    ? "bg-accent-primary hover:bg-accent-glow text-white border-0 shadow-accent-glow-sm" 
                    : "border-border-primary hover:bg-background-tertiary"
                )}
              >
                <Link href="/royxatdan-otish/klub-egasi">Ulanish</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
