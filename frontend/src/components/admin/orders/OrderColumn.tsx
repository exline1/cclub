"use client";

import React from "react";
import { Order } from "@/lib/admin-mock-data";
import OrderCard from "./OrderCard";
import { cn } from "@/lib/utils";
import { Coffee, ClipboardList, CheckCircle } from "lucide-react";

interface OrderColumnProps {
  title: string;
  status: "pending" | "preparing" | "delivered";
  orders: Order[];
  onAccept?: (orderId: string) => void;
  onReady?: (orderId: string) => void;
}

export default function OrderColumn({
  title,
  status,
  orders,
  onAccept,
  onReady,
}: OrderColumnProps) {
  const isPending = status === "pending";
  const isPreparing = status === "preparing";
  const isDelivered = status === "delivered";

  return (
    <div className="flex flex-col bg-background-secondary/10 border border-border-glass/20 rounded-2xl p-4 sm:p-5 flex-1 min-h-[50vh] space-y-4">
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between pb-3 border-b border-border-glass/25"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full shrink-0",
              isPending && "bg-status-occupied shadow-[0_0_10px_rgba(239,68,68,0.5)]",
              isPreparing && "bg-status-ending shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse",
              isDelivered && "bg-status-free shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            )}
          />
          <h3 className="font-heading text-sm font-bold text-text-primary tracking-wide">
            {title}
          </h3>
        </div>
        <span
          className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-bold border",
            isPending && "bg-status-occupied/10 text-status-occupied border-status-occupied/20",
            isPreparing && "bg-status-ending/10 text-status-ending border-status-ending/20",
            isDelivered && "bg-status-free/10 text-status-free border-status-free/20"
          )}
        >
          {orders.length}
        </span>
      </div>

      {/* Column Body Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[70vh]">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-text-secondary/50">
            {isPending ? (
              <ClipboardList className="h-10 w-10 mb-2 stroke-1" />
            ) : isPreparing ? (
              <Coffee className="h-10 w-10 mb-2 stroke-1" />
            ) : (
              <CheckCircle className="h-10 w-10 mb-2 stroke-1" />
            )}
            <p className="text-xs font-semibold">Buyurtmalar yo&apos;q</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={onAccept}
              onReady={onReady}
            />
          ))
        )}
      </div>
    </div>
  );
}
