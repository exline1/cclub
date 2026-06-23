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
    answer: "Ilova orqali 'Joy band qilish' tugmasini bosasiz. Kerakli zonani (Standard, VIP yoki PS5) va vaqtni tanlab, bir zumda band qilishingiz mumkin.",
  },
  {
    question: "Bar menyusidan buyurtma bersa bo'ladimi?",
    answer: "Ha, albatta! Bizning platformamiz orqali o'tirgan joyingizdan turib bar menyusidan ichimliklar, sendvichlar yoki shirinliklarni buyurtma qilishingiz mumkin. Buyurtmangiz to'g'ridan-to'g'ri kompyuteringizga olib kelinadi.",
  },
  {
    question: "VIP va PS5 zonalarida narxlar qanday?",
    answer: "Tariflarimiz bo'limida barcha narxlar bilan tanishishingiz mumkin. Standard va VIP zonalar uchun alohida soatlik va haftalik tariflar mavjud.",
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
    <section id="faq" className="py-20 lg:py-28 bg-background-primary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary mb-3">
            FAQ
          </p>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Ko'p so'raladigan savollar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
            CClub platformasi va xizmatlarimiz haqida batafsil ma'lumot.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-2xl border border-border-primary bg-background-secondary transition-all duration-300",
                  isOpen && "border-accent-primary/50 shadow-accent-glow-sm bg-background-tertiary"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between p-6 text-left text-text-primary focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-lg font-semibold">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-text-secondary transition-transform duration-300 shrink-0 ml-4",
                      isOpen && "rotate-180 text-accent-secondary"
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
                    <div className="border-t border-border-primary/50 p-6 pt-0 text-base leading-relaxed text-text-secondary mt-2">
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
