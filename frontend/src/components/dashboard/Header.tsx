"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    localStorage.removeItem("cclub_user");
    localStorage.removeItem("cclub_session");
    localStorage.removeItem("cclub_orders");
    toast.success("Tizimdan chiqildi!");
    router.push("/");
  };

  return (
    <header className="border-b border-border-glass bg-background-secondary py-4 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 select-none active:scale-95 transition-all">
          <Logo showText={false} className="h-10 w-10" />
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-free animate-pulse" />
              <span className="text-[10px] text-status-free font-bold sm:text-xs">
                6 ta kompyuter bo&apos;sh
              </span>
            </div>
          </div>

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
                  {userName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background-secondary border-border-glass text-text-primary">
              <div className="px-2 py-1.5 text-xs text-text-secondary select-none">
                Mening hisobim
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent-primary/20">
                <Link href="/profile" className="w-full flex items-center gap-2">
                  <User className="h-4 w-4 text-accent-glow" />
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
        </div>
      </div>
    </header>
  );
}
