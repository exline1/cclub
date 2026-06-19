"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Biz haqimizda", href: "#about" },
  { label: "Xizmatlar", href: "#services" },
  { label: "Zonalar", href: "#zones" },
  { label: "Aloqa", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass-nav border-b border-border-glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Kirish</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
              </Button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-glass text-text-primary transition-colors duration-200 hover:border-accent-glow lg:hidden"
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
            "overflow-hidden border-t border-border-glass bg-background-secondary transition-all duration-200 lg:hidden",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-sm text-text-secondary transition-colors duration-200 hover:bg-background-primary hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button variant="secondary" asChild className="w-full">
                <Link href="/login" onClick={closeMenu}>
                  Kirish
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register" onClick={closeMenu}>
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
