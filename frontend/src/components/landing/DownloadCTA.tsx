import { Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadCTA() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-cta-gradient" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-background-tertiary border border-border-primary rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          
          {/* Decorative glow inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl mb-6">
              Ilovani yuklab oling va <br className="hidden md:block" /> o'yinni boshlang
            </h2>
            <p className="text-base text-text-secondary mb-8 max-w-xl">
              CClub ilovasi orqali joy band qilish, balansni to'ldirish va real vaqtda bo'sh joylarni kuzatish endi yanada oson.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="h-14 px-8 bg-black hover:bg-zinc-900 text-white rounded-xl border border-zinc-800 transition-transform active:scale-95">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <Apple className="h-6 w-6" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] leading-none text-zinc-400">Yuklab olish</span>
                    <span className="text-sm font-semibold leading-none mt-1">App Store</span>
                  </div>
                </a>
              </Button>
              
              <Button asChild size="lg" className="h-14 px-8 bg-black hover:bg-zinc-900 text-white rounded-xl border border-zinc-800 transition-transform active:scale-95">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <Play className="h-5 w-5 fill-current" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] leading-none text-zinc-400">Yuklab olish</span>
                    <span className="text-sm font-semibold leading-none mt-1">Google Play</span>
                  </div>
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center z-10">
            {/* Mockup phone representation */}
            <div className="relative w-64 h-[500px] bg-background-primary rounded-[40px] border-8 border-background-secondary shadow-accent-glow flex items-center justify-center overflow-hidden rotate-12 hover:rotate-0 transition-all duration-700">
              <div className="absolute top-0 w-32 h-6 bg-background-secondary rounded-b-2xl z-20"></div>
              <div className="w-full h-full bg-card-gradient flex flex-col items-center justify-center p-6">
                 <div className="font-heading text-2xl font-bold text-accent-secondary mb-4">CClub</div>
                 <div className="w-full space-y-4">
                   <div className="h-24 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                   <div className="h-24 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                   <div className="h-24 w-full bg-background-tertiary rounded-xl border border-border-primary"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
