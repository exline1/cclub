import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_PATHS } from "@/lib/assets";

export interface ZoneItem {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  badge?: string;
}

const ZONES: ZoneItem[] = [
  {
    id: "standard",
    name: "Standard",
    description:
      "Kuchli kompyuterlar, qulay o'rindiqlar va tez internet — kundalik o'yin uchun ideal.",
    imageSrc: IMAGE_PATHS.zoneStandard,
  },
  {
    id: "vip",
    name: "VIP",
    description:
      "Premium jihozlar, keng monitorlar va alohida xona — maksimal komfort va performance.",
    imageSrc: IMAGE_PATHS.zoneVip,
    badge: "Premium",
  },
  {
    id: "ps5",
    name: "PS5",
    description:
      "PlayStation 5 konsollari, 4K televizorlar va eng so'nggi eksklyuziv o'yinlar to'plami.",
    imageSrc: IMAGE_PATHS.zonePs5,
    badge: "Konsol",
  },
];

export function Zones() {
  return (
    <section id="zones" className="bg-background-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-glow sm:text-sm">
            Zonalar
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            O&apos;zingizga mos zonani tanlang
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
            Har bir zona professional jihozlar va qulay muhit bilan jihozlangan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ZONES.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneCard({ zone }: { zone: ZoneItem }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:border-accent-glow hover:shadow-accent-glow-sm">
      {/* Rasm placeholder — tegishli faylni public/images/ da almashtiring */}
      <div className="relative aspect-[16/10] w-full bg-background-primary">
        <Image
          src={zone.imageSrc}
          alt={`${zone.name} zona — gaming klub`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
        {zone.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-primary px-3 py-1 text-xs font-bold text-white">
            {zone.badge}
          </span>
        )}
      </div>
      <CardHeader>
        <CardTitle>{zone.name}</CardTitle>
        <CardDescription className="leading-relaxed">
          {zone.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-status-free" />
          Bo&apos;sh joylar mavjud
        </div>
      </CardContent>
    </Card>
  );
}
