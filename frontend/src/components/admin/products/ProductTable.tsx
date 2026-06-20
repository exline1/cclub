"use client";

import React, { useState } from "react";
import { Edit2, Trash2, AlertTriangle, Coffee, ArrowUpDown, Package } from "lucide-react";
import { Product } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [sortField, setSortField] = useState<"price" | "stock" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleSort = (field: "price" | "stock") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
    if (sortField === "stock") {
      return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock;
    }
    return 0;
  });
  // Translate category key to Uzbek labels
  const getCategoryLabel = (category: Product["category"]) => {
    switch (category) {
      case "drink":
        return "Ichimlik";
      case "snack":
        return "Snack";
      case "fastfood":
        return "Fastfood";
      default:
        return category;
    }
  };

  const getCategoryStyle = (category: Product["category"]) => {
    switch (category) {
      case "drink":
        return "bg-accent-glow/10 text-accent-glow border-accent-glow/20";
      case "snack":
        return "bg-status-ending/10 text-status-ending border-status-ending/20";
      case "fastfood":
        return "bg-status-free/10 text-status-free border-status-free/20";
      default:
        return "bg-background-primary text-text-secondary";
    }
  };

  return (
    <div className="glass-card border border-border-glass/40 bg-background-secondary/30 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-border-glass/30 bg-background-primary/40 text-text-secondary text-[10px] uppercase font-bold tracking-wider select-none">
              <th className="p-4 pl-6">Mahsulot</th>
              <th className="p-4">Kategoriya</th>
              <th 
                className="p-4 text-right cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Narxi
                  <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "price" ? "text-accent-glow" : "opacity-40")} />
                </div>
              </th>
              <th 
                className="p-4 text-center cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort("stock")}
              >
                <div className="flex items-center justify-center gap-1">
                  Qoldiq (Stock)
                  <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "stock" ? "text-accent-glow" : "opacity-40")} />
                </div>
              </th>
              <th className="p-4 text-center">Holati</th>
              <th className="p-4 pr-6 text-center">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-glass/10">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-text-secondary/55">
                  <Coffee className="h-10 w-10 mx-auto mb-2 opacity-50 stroke-1" />
                  <p className="text-xs font-semibold">Mahsulotlar topilmadi</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Yangi mahsulot qo&apos;shish uchun yuqoridagi tugmani bosing.</p>
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => {
                const { id, name, category, price, stock, imageUrl } = product;
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock < 5;

                return (
                  <tr
                    key={id}
                    className={cn(
                      "hover:bg-background-primary/20 transition-colors group",
                      isOutOfStock && "bg-status-occupied/[0.02]",
                      isLowStock && "bg-status-ending/[0.01]"
                    )}
                  >
                     {/* Image and Name */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      {failedImages[id] ? (
                        <div className={cn(
                          "h-10 w-10 rounded-lg bg-background-secondary border border-border-glass/40 flex items-center justify-center shrink-0 text-text-secondary/70",
                          isOutOfStock && "filter grayscale opacity-55"
                        )}>
                          <Package className="h-5 w-5" />
                        </div>
                      ) : (
                        <img
                          src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=40"}
                          alt={name}
                          className={cn(
                            "h-10 w-10 rounded-lg object-cover bg-background-primary border shrink-0 transition-transform group-hover:scale-105 duration-200",
                            isOutOfStock ? "border-status-occupied/40 filter grayscale" : "border-border-glass/40"
                          )}
                          onError={() => {
                            setFailedImages((prev) => ({ ...prev, [id]: true }));
                          }}
                        />
                      )}
                      <span className="font-semibold text-text-primary text-xs sm:text-sm">
                        {name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border capitalize",
                          getCategoryStyle(category)
                        )}
                      >
                        {getCategoryLabel(category)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 text-right font-bold text-accent-glow">
                      {price.toLocaleString()} so&apos;m
                    </td>

                    {/* Stock */}
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "font-heading font-extrabold text-xs px-2 py-0.5 rounded-lg border",
                          isOutOfStock && "bg-status-occupied/10 text-status-occupied border-status-occupied/20",
                          isLowStock && "bg-status-ending/10 text-status-ending border-status-ending/25 animate-pulse",
                          !isOutOfStock && !isLowStock && "bg-background-primary text-text-secondary border-border-glass/30"
                        )}
                      >
                        {stock} ta
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-occupied uppercase tracking-wider bg-status-occupied/5 border border-status-occupied/20 px-2 py-0.5 rounded">
                          Tugagan
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-ending uppercase tracking-wider bg-status-ending/5 border border-status-ending/20 px-2 py-0.5 rounded">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          Kam qoldi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-free uppercase tracking-wider bg-status-free/5 border border-status-free/20 px-2 py-0.5 rounded">
                          Mavjud
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          aria-label="Tahrirlash"
                          className="p-1.5 rounded-lg border border-border-glass/40 bg-background-primary/30 text-text-secondary hover:text-accent-glow hover:border-accent-glow/50 active:scale-95 transition-all duration-200"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(id)}
                          aria-label="O'chirish"
                          className="p-1.5 rounded-lg border border-border-glass/40 bg-background-primary/30 text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 active:scale-95 transition-all duration-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
