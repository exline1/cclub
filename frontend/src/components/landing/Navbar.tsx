"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu, X, MapPin, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { navSlideDown, fadeIn, staggerContainer } from "@/lib/animations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { shouldAnimate } = useDesktopAnimation();

  useEffect(() => {
    const storedUser = localStorage.getItem("cclub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cclub_user");
    localStorage.removeItem("cclub_session");
    localStorage.removeItem("cclub_orders");
    setUser(null);
    toast.success("Tizimdan chiqildi!");
    router.push("/");
  };

  const closeMenu = () => setIsOpen(false);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const Nav = shouldAnimate ? motion.nav : "nav";
  const navProps = shouldAnimate
    ? { variants: navSlideDown, initial: "hidden", animate: "visible" }
    : {};

  const LinkItem = shouldAnimate ? motion.li : "li";
  const linkItemProps = shouldAnimate ? { variants: fadeIn } : {};

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Nav
        {...navProps}
        className="glass-nav border-b border-border-primary bg-background-primary/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 xl:flex">
            <ul className="flex items-center gap-6">
              <LinkItem {...linkItemProps}>
                <Link
                  href="/clublar"
                  className="inline-flex items-center gap-1.5 font-semibold text-accent-secondary transition-colors duration-200 hover:text-accent-glow"
                >
                  <MapPin className="h-4 w-4" />
                  Barcha game clublar
                </Link>
              </LinkItem>
              <div className="h-4 w-px bg-border-primary"></div>
              {NAV_LINKS.map((link) => (
                <LinkItem key={link.href} {...linkItemProps}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </LinkItem>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      type="button" 
                      aria-label="Profil menyusi"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-3xl border border-border-glass bg-background-primary/50 hover:bg-background-primary hover:border-accent-glow transition-all duration-200 active:scale-95"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-deep border border-accent-glow/50 text-[11px] font-bold text-text-primary">
                        {initial}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-text-primary max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background-secondary border-border-glass text-text-primary">
                    <div className="px-2 py-1.5 text-xs text-text-secondary select-none font-bold">
                      {user.name}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent-primary/20">
                      <Link href="/dashboard" className="w-full flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-accent-glow" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent-primary/20">
                      <Link href="/profile" className="w-full flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-accent-glow" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-status-occupied focus:bg-status-occupied/10 focus:text-status-occupied"
                    >
                      <div className="w-full flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Chiqish</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hover:bg-background-tertiary">
                    <Link href="/login">Kirish</Link>
                  </Button>
                  <Button asChild className="bg-accent-primary hover:bg-accent-glow">
                    <Link href="/royxatdan-otish">Ro&apos;yxatdan o&apos;tish</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-primary text-text-primary transition-colors duration-200 hover:border-accent-primary xl:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu — NO Framer Motion, CSS only */}
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
              className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-semibold text-accent-secondary transition-colors duration-200 hover:bg-background-tertiary"
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
                className="block rounded-2xl px-3 py-3 text-base font-medium text-text-secondary transition-colors duration-200 hover:bg-background-tertiary hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-semibold text-text-primary hover:bg-background-tertiary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base font-semibold text-text-primary hover:bg-background-tertiary"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-base font-semibold text-status-occupied hover:bg-status-occupied/10"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </Nav>
    </header>
  );
}
