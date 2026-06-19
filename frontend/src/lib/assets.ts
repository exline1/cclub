/**
 * Rasm yo'llari — faqat faylni almashtiring, kodga tegmang.
 * Masalan: public/images/hero-bg.jpg faylini o'z rasmingiz bilan almashtiring.
 */
export const IMAGE_PATHS = {
  logo: "/logo.png",
  heroBg: "/images/hero-bg.jpg",
  zoneStandard: "/images/zone-standard.jpg",
  zoneVip: "/images/zone-vip.jpg",
  zonePs5: "/images/zone-ps5.jpg",
} as const;

export type ImagePathKey = keyof typeof IMAGE_PATHS;
