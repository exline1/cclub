"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "CClub bepulmi?",
    answer: "Mijozlar uchun CClub platformasidan foydalanish va joy band qilish mutlaqo bepul. Klub egalari uchun maxsus tariflar mavjud.",
  },
  {
    question: "Klubimni qanday qo\u2018shaman?",
    answer: "Platformaga klub qo\u2018shish uchun 'Klubingizni qo\u2018shing' tugmasini bosing va ro\u2018yxatdan o\u2018tish jarayonidan o\u2018ting. Shundan so\u2018ng boshqaruv paneliga kirishingiz mumkin bo\u2018ladi.",
  },
  {
    question: "Mijoz sifatida ro\u2018yxatdan o\u2018tish shart ekanmi?",
    answer: "Ha, klublarni ko\u2018rish va joy band qilish uchun tizimda ro\u2018yxatdan o\u2018tishingiz lozim. Bu orqali siz o\u2018z buyurtmalaringiz tarixini ham kuzatib borishingiz mumkin.",
  },
  {
    question: "Tizim qanday qurilmada ishlaydi?",
    answer: "CClub istalgan qurilmada ishlaydi: smartfon, planshet, noutbuk yoki shaxsiy kompyuter. Siz brauzer orqali kirsangiz kifoya.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { shouldAnimate } = useDesktopAnimation();

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const Header = shouldAnimate ? motion.div : "div";
  const headerProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const List = shouldAnimate ? motion.div : "div";
  const listProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Item = shouldAnimate ? motion.div : "div";
  const itemProps = shouldAnimate ? { variants: fadeUp } : {};

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background-primary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Header {...headerProps} className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-primary mb-3">
            FAQ
          </p>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Ko&apos;p so&apos;raladigan savollar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
            CClub platformasi va xizmatlarimiz haqida batafsil ma&apos;lumot.
          </p>
        </Header>

        <List {...listProps} className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Item
                key={index}
                {...itemProps}
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
                      isOpen && "rotate-180 text-accent-primary"
                    )}
                  />
                </button>
                {shouldAnimate ? (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border-primary/50 p-6 pt-0 text-base leading-relaxed text-text-secondary mt-2">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
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
                )}
              </Item>
            );
          })}
        </List>
      </div>
    </section>
  );
}
