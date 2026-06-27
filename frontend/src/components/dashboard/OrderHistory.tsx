"use client";

import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "tayyorlanmoqda" | "yetkazildi";
  date: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border-glass/40">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <ClipboardList className="h-4.5 w-4.5 text-accent-glow" />
          Buyurtmalarim
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="h-10 w-10 text-text-secondary/40 mb-3" />
            <p className="text-sm font-semibold text-text-secondary">Hali buyurtma qilmadingiz</p>
            <p className="text-xs text-text-secondary/60 mt-1 max-w-[240px]">
              O&apos;yin vaqtida salqin ichimliklar yoki gazaklar buyurtma berishingiz mumkin.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4.5 rounded-2xl border border-border-glass bg-background-primary/40 space-y-3"
              >
                {/* Order header */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-text-primary">Buyurtma #{order.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === "tayyorlanmoqda"
                        ? "bg-status-ending/10 text-status-ending border border-status-ending/30"
                        : "bg-status-free/10 text-status-free border border-status-free/30"
                    }`}
                  >
                    {order.status === "tayyorlanmoqda" ? "Tayyorlanmoqda" : "Yetkazildi"}
                  </span>
                </div>

                {/* Items list */}
                <div className="divide-y divide-border-glass/20 border-y border-border-glass/20 py-2 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-text-secondary pt-1 first:pt-0">
                      <span>
                        {item.name} <span className="text-text-secondary/60">x{item.quantity}</span>
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString()} so&apos;m</span>
                    </div>
                  ))}
                </div>

                {/* Summary info */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <span className="text-text-secondary">{order.date}</span>
                  <span className="font-bold text-accent-glow">
                    Jami: {order.total.toLocaleString()} so&apos;m
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
