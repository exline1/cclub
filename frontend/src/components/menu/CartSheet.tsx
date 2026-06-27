"use client";

import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    category: string;
  };
  quantity: number;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSheetProps) {
  if (!isOpen) return null;

  const totalSum = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="relative w-full max-w-md bg-background-secondary border-l border-border-glass h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-glass/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent-glow" />
            <h2 className="font-heading text-base font-bold text-text-primary">Xarid savati</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="text-text-secondary hover:text-text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-full border border-border-glass/40 hover:border-accent-glow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-14 w-14 text-text-secondary/20 mb-3" />
              <p className="font-semibold text-text-secondary text-sm">Savat bo&apos;sh</p>
              <p className="text-xs text-text-secondary/60 mt-1 max-w-[200px]">
                Buyurtma qilish uchun mahsulotlarni savatga qo&apos;shing.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-border-glass bg-background-primary/40 gap-3"
              >
                <div className="text-2xl shrink-0">{item.product.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-accent-glow font-bold mt-0.5">
                    {item.product.price.toLocaleString()} so&apos;m
                  </p>
                </div>
                
                {/* Quantity adjuster */}
                <div className="flex items-center gap-1.5 bg-background-primary border border-border-glass rounded-full p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    aria-label="Kamaytirish"
                    className="h-6 w-6 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold text-text-primary px-1 select-none">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    aria-label="Ko'paytirish"
                    className="h-6 w-6 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-text-secondary hover:text-status-occupied transition-colors p-1.5 rounded-full hover:bg-status-occupied/10"
                  aria-label="Mahsulotni o'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-border-glass/40 bg-background-secondary/80 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-text-secondary font-medium">Jami:</span>
              <span className="font-heading text-lg sm:text-xl font-bold text-accent-glow">
                {totalSum.toLocaleString()} so&apos;m
              </span>
            </div>
            <Button onClick={onCheckout} className="w-full text-xs sm:text-sm">
              Buyurtma berish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
