"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Telegram",
    href: "https://t.me/cclub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/cclub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/cclub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { shouldAnimate } = useDesktopAnimation();

  const Grid = shouldAnimate ? motion.div : "div";
  const gridProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Col = shouldAnimate ? motion.div : "div";
  const colProps = shouldAnimate ? { variants: fadeUp } : {};

  return (
    <footer id="contact" className="border-t border-border-primary bg-background-primary md:bg-transparent py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Grid {...gridProps} className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <Col {...colProps} className="space-y-4">
            <Logo href="/" />
            <p className="text-sm leading-relaxed text-text-secondary mt-4">
              Kompyuter o&apos;yinlari markazlari uchun zamonaviy buyurtma va boshqaruv
              platformasi.
            </p>
          </Col>

          {/* Contact */}
          <Col {...colProps} className="space-y-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-primary">
              Aloqa
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-secondary" aria-hidden="true" />
                <span>Toshkent sh., Amir Temur ko&apos;chasi 108</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-secondary" aria-hidden="true" />
                <a
                  href="tel:+998901234567"
                  className="transition-colors duration-200 hover:text-text-primary"
                >
                  +998 90 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-secondary" aria-hidden="true" />
                <a
                  href="mailto:info@cclub.uz"
                  className="transition-colors duration-200 hover:text-text-primary"
                >
                  info@cclub.uz
                </a>
              </li>
            </ul>
          </Col>

          {/* Working hours */}
          <Col {...colProps} className="space-y-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-primary">
              Ish vaqti
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent-secondary" aria-hidden="true" />
                <span>Dushanba — Juma: 10:00 — 02:00</span>
              </li>
              <li className="flex items-center gap-3 pl-7">
                <span>Shanba — Yakshanba: 09:00 — 03:00</span>
              </li>
            </ul>
          </Col>

          {/* Social */}
          <Col {...colProps} className="space-y-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-primary">
              Ijtimoiy tarmoqlar
            </h3>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-all duration-200 hover:border-accent-secondary hover:text-accent-secondary hover:shadow-accent-glow-sm bg-background-secondary hover:bg-background-tertiary"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </Col>
        </Grid>

        <div className="mt-10 border-t border-border-primary pt-6 text-center text-xs text-text-secondary sm:text-sm">
          <p>&copy; {currentYear} CClub. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
