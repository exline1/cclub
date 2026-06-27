"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/admin-mock-data";
import { Clock, User, Coffee, Check, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onAccept?: (orderId: string) => void;
  onReady?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}

export default function OrderCard({ order, onAccept, onReady, onCancel }: OrderCardProps) {
  const [minutesAgo, setMinutesAgo] = useState(0);

  // Minutes ago offset calculator
  useEffect(() => {
    const calculateTime = () => {
      const { createdAt } = order;
      if (createdAt.includes(":")) {
        const [h, m] = createdAt.split(":").map(Number);
        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();

        let diff = (currentH - h) * 60 + (currentM - m);
        if (diff < 0) diff += 24 * 60; // rollover
        setMinutesAgo(diff);
      } else {
        const created = new Date(createdAt);
        if (isNaN(created.getTime())) {
          setMinutesAgo(0);
          return;
        }
        const diffMs = Date.now() - created.getTime();
        setMinutesAgo(Math.max(0, Math.floor(diffMs / 60000)));
      }
    };

    calculateTime();
    // Update count every minute
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [order]);

  const formatMinutesAgo = (mins: number) => {
    if (mins === 0) return "Hozirgina";
    if (mins < 60) return `${mins} daqiqa oldin`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} soat oldin`;
    return `${Math.floor(hrs / 24)} kun oldin`;
  };

  const isPending = order.status === "pending";
  const isPreparing = order.status === "preparing";
  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";

  return (
    <div
      className={cn(
        "glass-card p-4  /40 /30 flex flex-col gap-3 shadow-sm hover:border-accent-glow/50 transition-all duration-300 animate-in fade-in zoom-in-95"
      )}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <span className="font-heading font-black text-base text-text-primary tracking-tight">
          PC {order.computerNumber}
        </span>
        <span className="text-[10px] text-text-secondary font-semibold">
          #{order.id}
        </span>
      </div>

      {/* Ordered items listing */}
      <div className="space-y-1.5 border-y border-border-glass/20 py-2.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <span className="text-text-secondary truncate max-w-[180px] flex items-center gap-1.5">
              <Coffee className="h-3 w-3 text-accent-glow shrink-0" />
              {item.name}
            </span>
            <span className="text-text-primary font-bold bg-background-primary/80 px-2 py-0.5 rounded-full border border-border-glass/40 scale-90">
              x{item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Relative Time and Price */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-text-secondary text-[10px] font-semibold">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {formatMinutesAgo(minutesAgo)}
        </div>
        {order.total && (
          <span className="font-heading font-bold text-accent-glow">
            {order.total.toLocaleString()} so&apos;m
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="pt-1.5">
        {isPending && onAccept && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onAccept(order.id)}
              className="flex-1 bg-accent-primary hover:bg-accent-glow text-white font-bold py-2 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200 shadow-lg shadow-accent-primary/10"
            >
              <Play className="h-3 w-3 fill-current" />
              Qabul qilish
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Buyurtmani (#${order.id}) bekor qilmoqchimisiz?`)) {
                    onCancel(order.id);
                  }
                }}
                className="px-3 py-2 rounded-2xl border border-border-glass bg-background-primary/30 text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 active:scale-95 transition-all duration-200 text-xs font-bold"
              >
                Bekor qilish
              </button>
            )}
          </div>
        )}
        {isPreparing && onReady && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReady(order.id)}
              className="flex-1 bg-status-free hover:bg-status-free/90 text-white font-bold py-2 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200 shadow-lg shadow-status-free/10"
            >
              <Check className="h-3.5 w-3.5" />
              Tayyor
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Buyurtmani (#${order.id}) bekor qilmoqchimisiz?`)) {
                    onCancel(order.id);
                  }
                }}
                className="px-3 py-2 rounded-2xl border border-border-glass bg-background-primary/30 text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 active:scale-95 transition-all duration-200 text-xs font-bold"
              >
                Bekor qilish
              </button>
            )}
          </div>
        )}
        {isDelivered && (
          <div className="w-full py-1.5 rounded-full bg-status-free/10 border border-status-free/20 text-status-free text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Check className="h-3 w-3" />
            Yetkazildi
          </div>
        )}
        {isCancelled && (
          <div className="w-full py-1.5 rounded-full bg-status-occupied/10 border border-status-occupied/25 text-status-occupied text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <X className="h-3 w-3" />
            Bekor qilindi
          </div>
        )}
      </div>
    </div>
  );
}
