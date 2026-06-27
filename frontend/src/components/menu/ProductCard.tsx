"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  desc: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const GRADIENTS = [
  "from-indigo-900/40 to-blue-900/20 border-indigo-500/10",
  "from-violet-900/40 to-fuchsia-900/20 border-violet-500/10",
  "from-emerald-900/40 to-teal-900/20 border-emerald-500/10",
];

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Select gradient based on product id hash
  const gradientIdx = parseInt(product.id) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIdx];

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-glow hover:shadow-accent-glow-sm flex flex-col justify-between h-full">
      
      {/* Product Avatar/Header */}
      <div className={`relative aspect-[16/10] w-full flex items-center justify-center bg-gradient-to-br ${gradient} border-b`}>
        <span className="text-5xl sm:text-6xl drop-shadow-md select-none transform hover:scale-110 transition-transform duration-200">
          {product.emoji}
        </span>
        <span className="absolute bottom-2.5 left-3 rounded-full bg-background-primary/80 px-2 py-0.5 text-[10px] font-bold text-text-secondary border border-border-glass/40 uppercase">
          {product.category}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base sm:text-lg line-clamp-1">{product.name}</CardTitle>
          <p className="text-xs text-text-secondary leading-relaxed mt-1.5 min-h-[32px] line-clamp-2">
            {product.desc}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="font-heading text-sm sm:text-base font-bold text-accent-glow">
              {product.price.toLocaleString()} so&apos;m
            </span>
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="h-9 px-3 bg-accent-deep/40 border border-border-glass text-accent-glow hover:bg-accent-primary hover:text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Savatga
            </Button>
          </div>
        </CardContent>
      </div>

    </Card>
  );
}
