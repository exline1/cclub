"use client";

import { cn } from "@/lib/utils";

interface MenuFilterProps {
  activeCategory: string;
  onChangeCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "Barchasi" },
  { id: "Snack", label: "Snacklar" },
  { id: "Drink", label: "Ichimliklar" },
  { id: "Fastfood", label: "Fastfud" },
];

export function MenuFilter({ activeCategory, onChangeCategory }: MenuFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChangeCategory(cat.id)}
          className={cn(
            "rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-200 border whitespace-nowrap active:scale-95",
            activeCategory === cat.id
              ? "bg-accent-primary border-accent-glow text-white shadow-accent-glow-sm"
              : "bg-background-secondary border-border-glass text-text-secondary hover:text-text-primary hover:border-accent-glow/50"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
