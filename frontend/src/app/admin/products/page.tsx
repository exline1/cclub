"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, HelpCircle, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PRODUCTS, Product } from "@/lib/admin-mock-data";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductFormModal from "@/components/admin/products/ProductFormModal";
import { cn } from "@/lib/utils";

type CategoryFilter = "Hammasi" | Product["category"];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Hammasi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial State Load
  useEffect(() => {
    const saved = localStorage.getItem("cclub_admin_products");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(MOCK_PRODUCTS);
      }
    } else {
      setProducts(MOCK_PRODUCTS);
      localStorage.setItem("cclub_admin_products", JSON.stringify(MOCK_PRODUCTS));
    }
    setIsMounted(true);
  }, []);

  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    localStorage.setItem("cclub_admin_products", JSON.stringify(updatedList));
  };

  // CRUD Actions
  const handleSaveProduct = (productData: Omit<Product, "id"> & { id?: string }) => {
    if (productData.id) {
      // Editing Mode
      const updated = products.map((p) => {
        if (p.id === productData.id) {
          return {
            ...p,
            name: productData.name,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            imageUrl: productData.imageUrl,
          };
        }
        return p;
      });
      saveProducts(updated);
      toast.success(`"${productData.name}" tahrirlandi.`);
    } else {
      // Adding Mode
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        imageUrl: productData.imageUrl,
      };
      const updated = [newProduct, ...products];
      saveProducts(updated);
      toast.success(`"${productData.name}" qo'shildi.`);
    }
    setEditingProduct(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    const item = products.find((p) => p.id === productId);
    if (!item) return;

    if (confirm(`"${item.name}" mahsulotini rostdan ham o'chirmoqchimisiz?`)) {
      const updated = products.filter((p) => p.id !== productId);
      saveProducts(updated);
      toast.error(`"${item.name}" o'chirildi.`);
    }
  };

  // Computations
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Hammasi" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category counts
  const totalCount = products.length;
  const drinkCount = products.filter((p) => p.category === "drink").length;
  const snackCount = products.filter((p) => p.category === "snack").length;
  const foodCount = products.filter((p) => p.category === "fastfood").length;
  
  // Alert stats
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 5).length;

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Ombor yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Mahsulotlar ombori
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Klub oshxonasi va bari tarkibini sozlash hamda inventarizatsiya
          </p>
        </div>

        {/* Add Product trigger */}
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-glow hover:bg-accent-glow/95 border border-accent-glow/50 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-accent-glow/15 shrink-0"
        >
          <Plus className="h-4 w-4 shrink-0" />
          Mahsulot qo&apos;shish
        </button>
      </div>

      {/* Alert Cards Row */}
      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-status-occupied/20 bg-status-occupied/5 animate-in slide-in-from-top-2 duration-200">
              <div className="h-9 w-9 rounded-full bg-status-occupied/10 text-status-occupied flex items-center justify-center shrink-0">
                <PackageOpen className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary">Tugagan mahsulotlar bor!</p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Omborda <strong className="text-status-occupied font-bold">{outOfStockCount} xil</strong> mahsulot qoldig&apos;i butkul tugadi.
                </p>
              </div>
            </div>
          )}

          {lowStockCount > 0 && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-status-ending/25 bg-status-ending/5 animate-in slide-in-from-top-2 duration-200">
              <div className="h-9 w-9 rounded-full bg-status-ending/10 text-status-ending flex items-center justify-center shrink-0">
                <Filter className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary">Qoldiq kam qoldi!</p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Omborda <strong className="text-status-ending font-bold">{lowStockCount} xil</strong> mahsulot zaxirasi 5 donadan kam.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category filtering tab buttons */}
        <div className="flex bg-background-secondary/50 border border-border-glass/50 p-1 rounded-3xl w-full md:w-auto shrink-0 select-none">
          {(["Hammasi", "drink", "snack", "fastfood"] as CategoryFilter[]).map((cat) => {
            const label =
              cat === "Hammasi"
                ? `Hammasi (${totalCount})`
                : cat === "drink"
                ? `Ichimliklar (${drinkCount})`
                : cat === "snack"
                ? `Snacklar (${snackCount})`
                : `Fastfood (${foodCount})`;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex-1 md:flex-none px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide transition-all active:scale-95 whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-accent-primary text-white shadow-accent-glow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Mahsulot nomi bo'yicha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-secondary/30 border border-border-glass/65 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-all"
          />
        </div>
      </div>

      {/* Main product listings table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add / Edit product modal dialog form */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </main>
  );
}
