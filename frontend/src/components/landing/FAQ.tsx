"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Klubda qanday kompyuterlar va konsollar bor?",
    answer: "Bizning klubimizda eng so'nggi RTX 4070/4080 grafik kartalariga ega professional gaming kompyuterlari, 240Hz/360Hz chastotali monitorlar hamda 4K ekranli PlayStation 5 konsollari o'rnatilgan.",
  },
  {
    question: "Joy band qilish qanday amalga oshiriladi?",
    answer: "Shaxsiy kabinetingizga kirib, 'Joy band qilish' tugmasini bosasiz. Kerakli zonani (Standard, VIP yoki PS5) va vaqtni tanlab, bir zumda band qilishingiz mumkin.",
  },
  {
    question: "Bar menyusidan buyurtma bersa bo'ladimi?",
    answer: "Ha, albatta! Bizning platformamiz orqali o'tirgan joyingizdan turib bar menyusidan ichimliklar, sendvichlar yoki shirinliklarni buyurtma qilishingiz mumkin. Buyurtmangiz to'g'ridan-to'g'ri kompyuteringizga olib kelinadi.",
  },
  {
    question: "VIP va PS5 zonalarida narxlar qanday?",
    answer: "Standard zona narxi soatiga 10,000 so'm, VIP zona (alohida xona va kuchaytirilgan jihozlar) 18,000 so'm, PlayStation 5 zonasi esa soatiga 25,000 so'mni tashkil etadi.",
  },
  {
    question: "Klub ish tartibi qanday?",
    answer: "Biz haftaning har kuni 24 soat davomida ishlaymiz. Dushanba-Juma kunlari texnik tozalash soatlari va bar menyusi to'liq rejimi mavjud, dam olish kunlari esa shinam muhit va maxsus aksiyalar sizni kutmoqda.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-glow sm:text-sm">
            FAQ
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            Tez-tez so&apos;raladigan savollar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
            cclub platformasi va klubimiz xizmatlari haqida batafsil ma&apos;lumot.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-xl border border-border-glass bg-background-secondary transition-all duration-300",
                  isOpen && "border-accent-glow/50 shadow-accent-glow-sm"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between p-5 text-left text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm font-bold sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-text-secondary transition-transform duration-300 shrink-0 ml-4",
                      isOpen && "rotate-180 text-accent-glow"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border-glass/40 p-5 text-sm leading-relaxed text-text-secondary sm:text-base">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
