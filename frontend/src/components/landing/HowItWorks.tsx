import { MonitorPlay, QrCode, MousePointerClick } from "lucide-react";

const STEPS = [
  {
    id: "SESSION_01",
    title: "Joy tanlang",
    description: "Ilova orqali kerakli zona va bo'sh kompyuterni tanlab, vaqtni belgilang.",
    icon: MousePointerClick,
  },
  {
    id: "SESSION_02",
    title: "Tasdiqlang",
    description: "Buyurtmani tasdiqlang va klubga kelib QR kodni administratorga ko'rsating.",
    icon: QrCode,
  },
  {
    id: "SESSION_03",
    title: "O'yinni boshlang",
    description: "Ajratilgan kompyuterga o'tirib, sevimli o'yiningizdan zavqlaning.",
    icon: MonitorPlay,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-background-primary overflow-hidden">
      {/* Decorative gradient element */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Qanday ishlaydi?
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            CClub orqali o'z joyingizni band qilish juda oson. 3 ta oddiy qadam bilan o'yinga tayyor bo'ling.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border-primary to-transparent -translate-y-1/2" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background-secondary border border-border-primary hover:border-accent-primary/50 transition-colors duration-300 relative z-10 hover:shadow-card-hover hover:-translate-y-1">
                  
                  {/* Step Label (JetBrains Mono) */}
                  <div className="absolute -top-4 bg-background-tertiary border border-border-primary px-3 py-1 rounded-md font-mono text-xs font-semibold text-accent-secondary tracking-widest shadow-sm">
                    {step.id}
                  </div>

                  <div className="mt-6 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="mb-3 font-heading text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
