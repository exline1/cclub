"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Image as ImageIcon } from "lucide-react";
import { Product } from "@/lib/admin-mock-data";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // If null, we are adding a new product. If not null, we are editing.
  onSave: (productData: Omit<Product, "id"> & { id?: string }) => void;
}

const DEFAULT_IMAGES = {
  drink: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&auto=format&fit=crop&q=60",
  snack: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=200&auto=format&fit=crop&q=60",
  fastfood: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60"
};

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("drink");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price));
      setStock(String(product.stock));
      setImageUrl(product.imageUrl);
      setErrors({});
    } else {
      setName("");
      setCategory("drink");
      setPrice("");
      setStock("");
      setImageUrl("");
      setErrors({});
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) {
      tempErrors.name = "Nom kiriting.";
    }
    
    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      tempErrors.price = "Narxi 0 dan yuqori raqam bo'lishi kerak.";
    }

    const parsedStock = Number(stock);
    if (stock === "" || isNaN(parsedStock) || parsedStock < 0) {
      tempErrors.stock = "Qoldiq 0 dan kichik bo'lolmaydi.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Use default image if none provided
    const finalImageUrl = imageUrl.trim() || DEFAULT_IMAGES[category];

    onSave({
      id: product?.id, // include if editing
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl: finalImageUrl,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative glass-card w-full max-w-md    p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-glass/40 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
              {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {product ? "Mahsulot tafsilotlarini o'zgartirish" : "Katalog uchun yangi mahsulot yaratish"}
            </p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
          {/* Product Name */}
          <div className="space-y-1">
            <label htmlFor="prod-name" className="text-xs font-semibold text-text-secondary block">
              Mahsulot nomi *
            </label>
            <input
              id="prod-name"
              type="text"
              placeholder="Masalan, Coca-Cola 0.5L"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-background-primary border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all ${
                errors.name ? "border-status-occupied" : "border-border-glass/60"
              }`}
            />
            {errors.name && (
              <span className="text-[10px] text-status-occupied font-semibold mt-0.5 block">
                {errors.name}
              </span>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1">
            <label htmlFor="prod-cat" className="text-xs font-semibold text-text-secondary block">
              Kategoriya *
            </label>
            <select
              id="prod-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as Product["category"])}
              className="w-full bg-background-primary border border-border-glass/60 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all"
            >
              <option value="drink">Ichimlik</option>
              <option value="snack">Snack</option>
              <option value="fastfood">Fastfood</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Price Input */}
            <div className="space-y-1">
              <label htmlFor="prod-price" className="text-xs font-semibold text-text-secondary block">
                Narxi (UZS) *
              </label>
              <input
                id="prod-price"
                type="number"
                min="0"
                placeholder="Narxini kiriting"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full bg-background-primary border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all ${
                  errors.price ? "border-status-occupied" : "border-border-glass/60"
                }`}
              />
              {errors.price && (
                <span className="text-[10px] text-status-occupied font-semibold mt-0.5 block">
                  {errors.price}
                </span>
              )}
            </div>

            {/* Stock Input */}
            <div className="space-y-1">
              <label htmlFor="prod-stock" className="text-xs font-semibold text-text-secondary block">
                Qoldiq soni (Stock) *
              </label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                placeholder="Qancha mavjud"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`w-full bg-background-primary border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all ${
                  errors.stock ? "border-status-occupied" : "border-border-glass/60"
                }`}
              />
              {errors.stock && (
                <span className="text-[10px] text-status-occupied font-semibold mt-0.5 block">
                  {errors.stock}
                </span>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label htmlFor="prod-img" className="text-xs font-semibold text-text-secondary block">
              Rasm URL manzili
            </label>
            <div className="relative">
              <input
                id="prod-img"
                type="url"
                placeholder="Rasmning internetdagi manzili..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-background-primary border border-border-glass/60 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all"
              />
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary/60" />
            </div>
            <span className="text-[9px] text-text-secondary opacity-70 block mt-0.5 leading-relaxed">
              * Bo&apos;sh qoldirilsa, kategoriya bo&apos;yicha standart rasm o&apos;rnatiladi.
            </span>
          </div>

          {/* Actions footer inside form */}
          <div className="flex gap-3 pt-4 border-t border-border-glass/40 mt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-background-primary border border-border-glass hover:border-accent-glow/50 text-text-secondary hover:text-text-primary transition-all duration-200 text-xs font-bold active:scale-95"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-2xl bg-accent-glow hover:bg-accent-glow/90 text-white font-bold transition-all duration-200 text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-accent-glow/10"
            >
              <Save className="h-4 w-4" />
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
