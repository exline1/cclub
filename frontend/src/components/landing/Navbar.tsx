"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Qanday ishlaydi", href: "/#how-it-works" },
  { label: "Afzalliklar", href: "/#benefits" },
  { label: "Tariflar", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass-nav border-b border-border-primary bg-background-primary/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 xl:flex">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/clublar"
                  className="inline-flex items-center gap-1.5 font-semibold text-accent-secondary transition-colors duration-200 hover:text-accent-glow"
                >
                  <MapPin className="h-4 w-4" />
                  Barcha game clublar
                </Link>
              </li>
              <div className="h-4 w-px bg-border-primary"></div>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="hover:bg-background-tertiary">
                <Link href="/login">Kirish</Link>
              </Button>
              <Button asChild className="bg-accent-primary hover:bg-accent-glow">
                <Link href="/royxatdan-otish">Ro&apos;yxatdan o&apos;tish</Link>
              </Button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-primary text-text-primary transition-colors duration-200 hover:border-accent-primary xl:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden border-t border-border-primary bg-background-secondary transition-all duration-300 xl:hidden",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/clublar"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-accent-secondary transition-colors duration-200 hover:bg-background-tertiary"
            >
              <MapPin className="h-5 w-5" />
              Barcha game clublar
            </Link>
            <div className="my-2 border-t border-border-primary"></div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-base font-medium text-text-secondary transition-colors duration-200 hover:bg-background-tertiary hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" asChild className="w-full border-border-primary text-text-primary">
                <Link href="/login" onClick={closeMenu}>
                  Kirish
                </Link>
              </Button>
              <Button asChild className="w-full bg-accent-primary hover:bg-accent-glow text-white">
                <Link href="/royxatdan-otish" onClick={closeMenu}>
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
