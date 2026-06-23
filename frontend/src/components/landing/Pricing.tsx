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
    id: "hourly",
    name: "Soatlik",
    price: "15,000",
    duration: "so'm / soat",
    description: "Qisqa muddatli o'yinlar va do'stlar bilan vaqt o'tkazish uchun.",
    features: [
      "Standart kompyuterlar",
      "Klub umumiy zali",
      "Asosiy o'yinlar to'plami",
    ],
  },
  {
    id: "weekly",
    name: "Haftalik Abo",
    price: "150,000",
    duration: "so'm / hafta",
    description: "Doimiy o'yinchilar uchun eng maqbul taklif va VIP imtiyozlar.",
    features: [
      "Istalgan zonaga kirish",
      "Kuniga 5 soat bepul",
      "PS5 xonasidan foydalanish",
      "Ichimliklar uchun 10% chegirma",
    ],
    recommended: true,
  },
  {
    id: "owners",
    name: "Klub egalari",
    price: "Kelishuv",
    duration: "asosida",
    description: "Klubingizni CClub tizimiga qo'shing va boshqaruvni avtomatlashtiring.",
    features: [
      "To'liq CRM tizimi",
      "Moliyaviy hisobotlar",
      "Mijozlar bazasini boshqarish",
      "24/7 texnik qo'llab-quvvatlash",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-background-primary relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14 text-center sm:mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Tariflar va narxlar
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-text-secondary">
            O'zingizga mos tarifni tanlang va o'yindan zavqlaning.
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
                    <Check className="h-5 w-5 text-status-success shrink-0" />
                    <span className="text-sm text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                variant={plan.recommended ? "default" : "outline"} 
                className={cn(
                  "w-full h-12 text-base rounded-xl transition-all",
                  plan.recommended 
                    ? "bg-accent-primary hover:bg-accent-glow" 
                    : "border-border-primary bg-transparent hover:bg-background-tertiary"
                )}
              >
                <Link href={plan.id === "owners" ? "/contact" : "/login"}>
                  {plan.id === "owners" ? "Bog'lanish" : "Tanlash"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
