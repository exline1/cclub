import { Search, CalendarCheck, BarChart, Settings, HandCoins, MonitorPlay } from "lucide-react";

const BENEFITS = [
  {
    icon: Search,
    title: "Bir joyda hamma klub",
    description: "Sizning hududingizdagi eng yaxshi va mos klublarni tez qidirib toping.",
  },
  {
    icon: CalendarCheck,
    title: "Onlayn joy band qilish",
    description: "Uydan chiqmasdan bo'sh kompyuter yoki VIP xonani o'zingizga qulay vaqtga band qiling.",
  },
  {
    icon: HandCoins,
    title: "Narxlarni solishtirish",
    description: "Turli klublardagi narxlar va sharoitlarni osongina taqqoslab, to'g'ri qaror qabul qiling.",
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
    title: "Kamroq ish, ko'proq daromad",
    description: "Adminstrator yuklamasini kamaytirib, xatoliklarsiz uzluksiz biznes jarayonini ta'minlang.",
  },
];

export function BenefitCards() {
  return (
    <section id="benefits" className="py-20 lg:py-28 bg-background-secondary relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-primary mb-3">
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
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-deep text-accent-primary group-hover:scale-110 transition-transform duration-300">
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
