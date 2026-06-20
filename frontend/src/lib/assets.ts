/**
 * Rasm yo'llari — faqat faylni almashtiring, kodga tegmang.
 * Masalan: public/images/hero-bg.jpg faylini o'z rasmingiz bilan almashtiring.
 */
export const IMAGE_PATHS = {
  logo: "/logo.png",
  heroBg: "/images/hero-bg.png",
  zoneStandard: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  zoneVip: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80",
  zonePs5: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
} as const;

export type ImagePathKey = keyof typeof IMAGE_PATHS;
