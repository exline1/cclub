"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("gameclub_user");
    localStorage.removeItem("gameclub_session");
    localStorage.removeItem("gameclub_orders");
    toast.success("Tizimdan chiqildi!");
    router.push("/");
  };

  return (
    <header className="border-b border-border-glass bg-background-secondary py-4 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo showText={false} className="h-10 w-10" />
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h1 className="font-heading text-sm font-bold text-text-primary sm:text-base">
              Salom, {userName}! 👋
            </h1>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-status-free animate-pulse" />
              <span className="text-[10px] text-status-free font-bold sm:text-xs">
                6 ta kompyuter bo&apos;sh
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-glass text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 transition-colors duration-200"
            aria-label="Chiqish"
            title="Chiqish"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
