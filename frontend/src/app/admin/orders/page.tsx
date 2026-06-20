"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Plus, Sparkles, Coffee } from "lucide-react";
import { toast } from "sonner";
import { MOCK_ORDERS, Order, Computer } from "@/lib/admin-mock-data";
import OrderColumn from "@/components/admin/orders/OrderColumn";
import { NotificationItem } from "@/components/admin/orders/NotificationDropdown";

// Helper list of mock products for simulation
const MOCK_PRODUCTS = [
  { name: "Coca-Cola 0.5L", price: 12000 },
  { name: "Fanta 0.5L", price: 12000 },
  { name: "Lays Chips 90g", price: 16000 },
  { name: "Snickers Bar", price: 8000 },
  { name: "Classic Hot Dog", price: 18000 },
  { name: "Double Cheese Burger", price: 28000 },
  { name: "French Fries", price: 14000 },
  { name: "RedBull Energy Drink", price: 22000 },
  { name: "Mineral Water Nestlé", price: 6000 },
  { name: "Kurortniye Kirieshki", price: 6000 }
];

const VALID_PC_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 31, 32, 33, 34, 35, 41, 42, 43, 44
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial State Load
  useEffect(() => {
    const saved = localStorage.getItem("cclub_admin_orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        setOrders(MOCK_ORDERS);
      }
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem("cclub_admin_orders", JSON.stringify(MOCK_ORDERS));
    }
    setIsMounted(true);
  }, []);

  // Sync state changes with localStorage and raise sync events
  const saveOrders = (updatedList: Order[]) => {
    setOrders(updatedList);
    localStorage.setItem("cclub_admin_orders", JSON.stringify(updatedList));
    // Dispatch synchronization custom events
    window.dispatchEvent(new Event("cclub_orders_updated"));
    window.dispatchEvent(new Event("storage"));
  };

  const logActivity = (action: string, details: string, type: "pc" | "order" | "system" | "product") => {
    const saved = localStorage.getItem("cclub_admin_activity");
    let currentLogs = [];
    if (saved) {
      try {
        currentLogs = JSON.parse(saved);
      } catch (e) {}
    }
    const newLog = {
      id: `a_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    localStorage.setItem("cclub_admin_activity", JSON.stringify([newLog, ...currentLogs].slice(0, 100)));
    window.dispatchEvent(new Event("cclub_activity_updated"));
  };

  // Actions
  const handleAcceptOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "preparing" as const };
      }
      return o;
    });
    saveOrders(updated);
    toast.success(`Buyurtma qabul qilindi (#${orderId})`);
    logActivity(
      `Buyurtma qabul qilindi`,
      `PC ${order?.computerNumber || ""} buyurtmasi (#${orderId}) oshxonada tayyorlanmoqda.`,
      "order"
    );
  };

  const handleReadyOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "delivered" as const };
      }
      return o;
    });
    saveOrders(updated);
    toast.success(`Buyurtma yetkazildi (#${orderId})`);
    logActivity(
      `Buyurtma yetkazildi`,
      `PC ${order?.computerNumber || ""} buyurtmasi (#${orderId}) mijozga topshirildi.`,
      "order"
    );
  };

  // Simulation: Trigger incoming order
  const handleSimulateNewOrder = () => {
    // 1. Random computer
    const randomPcIdx = Math.floor(Math.random() * VALID_PC_NUMBERS.length);
    const randomPcNum = VALID_PC_NUMBERS[randomPcIdx];

    // 2. Random items (1 or 2 items)
    const itemsCount = Math.floor(Math.random() * 2) + 1;
    const selectedItems: { name: string; qty: number }[] = [];
    let calculatedTotal = 0;

    for (let i = 0; i < itemsCount; i++) {
      const randomProdIdx = Math.floor(Math.random() * MOCK_PRODUCTS.length);
      const prod = MOCK_PRODUCTS[randomProdIdx];
      const qty = Math.floor(Math.random() * 2) + 1; // 1 to 2
      
      // Avoid duplicates
      const existing = selectedItems.find((item) => item.name === prod.name);
      if (existing) {
        existing.qty += qty;
      } else {
        selectedItems.push({ name: prod.name, qty });
      }
      calculatedTotal += prod.price * qty;
    }

    // 3. New Order Object
    const newOrderId = String(1000 + Math.floor(Math.random() * 9000));
    const newOrder: Order = {
      id: newOrderId,
      computerNumber: randomPcNum,
      items: selectedItems,
      status: "pending",
      createdAt: new Date().toISOString(),
      total: calculatedTotal
    };

    // Insert at front
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);

    // 4. Fire "Dzing" Visual Toast
    toast.success(`Yangi buyurtma! (#${newOrderId})`, {
      description: `PC ${randomPcNum} dan ${selectedItems.length} xil mahsulot buyurtma qilindi.`,
      icon: <span className="text-lg animate-bounce">🛒</span>,
      duration: 5000,
    });

    logActivity(
      `Yangi buyurtma keldi`,
      `PC ${randomPcNum} dan yangi buyurtma (#${newOrderId}) qo'shildi.`,
      "order"
    );

    // 5. Add Notification
    const savedNotifs = localStorage.getItem("cclub_admin_notifications");
    let currentNotifs: NotificationItem[] = [];
    if (savedNotifs) {
      try {
        currentNotifs = JSON.parse(savedNotifs);
      } catch (e) {
        currentNotifs = [];
      }
    }

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Yangi buyurtma: PC ${randomPcNum}`,
      message: `${selectedItems.map((i) => `${i.name} (x${i.qty})`).join(", ")} buyurtma qilindi.`,
      createdAt: new Date().toISOString(),
      type: "order",
      isRead: false
    };

    const updatedNotifs = [newNotif, ...currentNotifs].slice(0, 30); // Keep max 30
    localStorage.setItem("cclub_admin_notifications", JSON.stringify(updatedNotifs));
    window.dispatchEvent(new Event("cclub_notifications_updated"));
  };

  // Group columns
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Buyurtmalar boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Mijozlar buyurtmalarini qabul qilish va yetkazib berish
          </p>
        </div>

        {/* Simulation trigger */}
        <button
          type="button"
          onClick={handleSimulateNewOrder}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-glow hover:bg-accent-glow/95 border border-accent-glow/50 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-accent-glow/15"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          Test: yangi buyurtma yuborish
        </button>
      </div>

      {/* Kanban Layout columns grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrderColumn
          title="Kutilmoqda"
          status="pending"
          orders={pendingOrders}
          onAccept={handleAcceptOrder}
        />
        <OrderColumn
          title="Tayyorlanmoqda"
          status="preparing"
          orders={preparingOrders}
          onReady={handleReadyOrder}
        />
        <OrderColumn
          title="Yetkazildi"
          status="delivered"
          orders={deliveredOrders}
        />
      </div>
    </main>
  );
}
