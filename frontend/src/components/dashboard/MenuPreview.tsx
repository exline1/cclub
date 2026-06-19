"use client";

import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PREVIEW_ITEMS = [
  { id: "1", name: "Coca-Cola 0.5L", category: "Drink", price: "8,000 so'm", emoji: "🥤" },
  { id: "2", name: "Lays Chips 90g", category: "Snack", price: "12,000 so'm", emoji: "🥔" },
  { id: "3", name: "Double Cheese Burger", category: "Fastfood", price: "28,000 so'm", emoji: "🍔" },
];

export function MenuPreview() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 border-b border-border-glass/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Coffee className="h-4.5 w-4.5 text-accent-glow" />
            Bar menyu preview
          </CardTitle>
          <Link
            href="/menu"
            className="inline-flex items-center text-xs font-bold text-accent-glow hover:text-accent-primary transition-colors duration-200"
          >
            Barchasini ko&apos;rish
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PREVIEW_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border-glass bg-background-primary transition-all duration-200 hover:border-accent-glow/50"
            >
              <div className="text-2xl sm:text-3xl">{item.emoji}</div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-text-primary line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-accent-glow font-semibold mt-0.5">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
