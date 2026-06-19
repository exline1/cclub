"use client";

import { useState } from "react";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_PATHS } from "@/lib/assets";
import { cn } from "@/lib/utils";

export interface ZoneItem {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  badge?: string;
  price: string;
}

const ZONES: ZoneItem[] = [
  {
    id: "standard",
    name: "Standard",
    description:
      "Kuchli kompyuterlar, qulay o'rindiqlar va tez internet — kundalik o'yin uchun ideal.",
    imageSrc: IMAGE_PATHS.zoneStandard,
    price: "10,000 so'm/soat",
  },
  {
    id: "vip",
    name: "VIP",
    description:
      "Premium jihozlar, keng monitorlar va alohida xona — maksimal komfort va performance.",
    imageSrc: IMAGE_PATHS.zoneVip,
    badge: "Premium",
    price: "18,000 so'm/soat",
  },
  {
    id: "ps5",
    name: "PS5",
    description:
      "PlayStation 5 konsollari, 4K televizorlar va eng so'nggi eksklyuziv o'yinlar to'plami.",
    imageSrc: IMAGE_PATHS.zonePs5,
    badge: "Konsol",
    price: "25,000 so'm/soat",
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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-glow hover:shadow-accent-glow-sm">
      {/* Background color fallback */}
      <div className="relative aspect-[16/10] w-full bg-background-primary overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-background-secondary to-accent-deep/30 transition-opacity duration-500",
            imageLoaded ? "opacity-0" : "opacity-100"
          )} 
        />
        <Image
          src={zone.imageSrc}
          alt={`${zone.name} zona — gaming klub`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-all duration-700 ease-in-out",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        {zone.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-primary px-3 py-1 text-xs font-bold text-white z-10">
            {zone.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/90 via-transparent to-transparent" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{zone.name}</CardTitle>
          <span className="text-sm font-bold text-accent-glow">{zone.price}</span>
        </div>
        <CardDescription className="leading-relaxed mt-2">
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
