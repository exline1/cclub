"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuFilter } from "@/components/menu/MenuFilter";
import { ProductCard, Product } from "@/components/menu/ProductCard";
import { CartSheet, CartItem } from "@/components/menu/CartSheet";
import { toast } from "sonner";

const PRODUCTS: Product[] = [
  // Snacks
  { id: "1", name: "Coca-Cola 0.5L", category: "Drink", price: 8000, emoji: "🥤", desc: "Muzdek salqin ichimlik o'yin paytidagi eng yaxshi hamroh." },
  { id: "2", name: "Lays Chips 90g", category: "Snack", price: 12000, emoji: "🥔", desc: "Tuzli va qarsildoq chips kartoshkalari." },
  { id: "3", name: "Double Cheese Burger", category: "Fastfood", price: 28000, emoji: "🍔", desc: "Ikki qavat go'sht va erigan pishloqli mazali burger." },
  { id: "4", name: "RedBull Energy Drink", category: "Drink", price: 22000, emoji: "⚡", desc: "Kuch va energiya beruvchi salqin energetik ichimlik." },
  { id: "5", name: "Classic Hot Dog", category: "Fastfood", price: 15000, emoji: "🌭", desc: "Sosiska va maxsus souslar bilan hot dog." },
  { id: "6", name: "French Fries", category: "Fastfood", price: 12000, emoji: "🍟", desc: "Qarsildoq qizartirilgan frantsuzcha kartoshka." },
  { id: "7", name: "Kurortniye Kirieshki", category: "Snack", price: 6000, emoji: "🍞", desc: "Sarimsoqpiyoz ta'mli qarsildoq quritilgan nonlar." },
  { id: "8", name: "Skittles Candy", category: "Snack", price: 10000, emoji: "🍬", desc: "Turli mevali va shirin chaynaladigan konfetlar." },
  { id: "9", name: "Mineral Water Nestlé", category: "Drink", price: 5000, emoji: "💧", desc: "Gazsiz toza tabiiy mineral ichimlik suvi." }
];

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category") || "all";
  
  // Normalize rawCategory. E.g. snack -> Snack, drink -> Drink, fastfood -> Fastfood
  const activeCategory = ["snack", "drink", "fastfood"].includes(rawCategory.toLowerCase())
    ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase()
    : "all";

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount (if user refreshes)
  useEffect(() => {
    const savedCart = localStorage.getItem("gameclub_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("gameclub_cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      const updated = [...cartItems, { product, quantity: 1 }];
      saveCart(updated);
    }
    toast.success(`${product.name} savatga qo'shildi!`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.product.id === id) {
          const qty = item.quantity + delta;
          return qty > 0 ? { ...item, quantity: qty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((item) => item.product.id !== id);
    saveCart(updated);
    toast.info("Mahsulot savatdan o'chirildi.");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Retrieve existing orders from localStorage
    const localOrders = localStorage.getItem("gameclub_orders");
    const existingOrders = localOrders ? JSON.parse(localOrders) : [];

    // Format current date and time
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const formattedDate = `Bugun, ${formattedTime}`;

    // Create new order structure
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      items: cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: "tayyorlanmoqda" as const,
      date: formattedDate,
    };

    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("gameclub_orders", JSON.stringify(updatedOrders));

    // Clear cart
    saveCart([]);
    localStorage.removeItem("gameclub_cart");
    setIsCartOpen(false);

    toast.success("Buyurtma qabul qilindi!", {
      description: "Buyurtma tayyorlanmoqda va tez orada olib kelinadi.",
    });

    // Redirect to dashboard to check order status
    router.push("/dashboard");
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    router.push(`?${params.toString()}`);
  };

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background-primary pb-16">
      {/* Top Header Navigation */}
      <header className="border-b border-border-glass bg-background-secondary py-4 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary px-3 h-10 border border-border-glass/40 hover:border-accent-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            Kabinetga
          </Button>

          <h1 className="font-heading text-sm font-bold text-text-primary sm:text-lg select-none">
            Bar &amp; Oshxona Menyu
          </h1>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-glass text-text-secondary hover:text-accent-glow hover:border-accent-glow transition-all duration-200 active:scale-95"
            aria-label="Savat"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-glow text-[10px] font-bold text-white shadow-accent-glow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Catalog View */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Horizontal Category Filtering */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary ml-1 select-none">
            Kategoriyalar
          </span>
          <MenuFilter
            activeCategory={activeCategory}
            onChangeCategory={handleCategoryChange}
          />
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Side Cart sheet Drawer */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background-primary text-text-primary">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-glow/20 border-t-accent-glow" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
