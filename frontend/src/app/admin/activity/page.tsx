"use client";

import React, { useState, useEffect } from "react";
import { History, ClipboardList, Trash2, SlidersHorizontal } from "lucide-react";
import { MOCK_ACTIVITIES, ActivityLog } from "@/lib/admin-mock-data";
import ActivityLogItem from "@/components/admin/activity/ActivityLogItem";
import { cn } from "@/lib/utils";

type LogTypeFilter = "Hammasi" | ActivityLog["type"];

export default function ActivityAdminPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<LogTypeFilter>("Hammasi");
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial State Load
  useEffect(() => {
    const saved = localStorage.getItem("cclub_admin_activity");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        setLogs(MOCK_ACTIVITIES);
      }
    } else {
      setLogs(MOCK_ACTIVITIES);
      localStorage.setItem("cclub_admin_activity", JSON.stringify(MOCK_ACTIVITIES));
    }
    setIsMounted(true);

    const handleUpdate = () => {
      const current = localStorage.getItem("cclub_admin_activity");
      if (current) {
        try {
          setLogs(JSON.parse(current));
        } catch (e) {}
      }
    };
    window.addEventListener("cclub_activity_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cclub_activity_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleClearLogs = () => {
    if (confirm("Haqiqatan ham barcha faoliyat jurnallarini o'chirib tashlamoqchimisiz?")) {
      setLogs([]);
      localStorage.setItem("cclub_admin_activity", JSON.stringify([]));
      window.dispatchEvent(new Event("cclub_activity_updated"));
    }
  };

  // Filter
  const filteredLogs = logs.filter((log) => {
    return selectedFilter === "Hammasi" || log.type === selectedFilter;
  });

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Jurnal yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title & stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Faoliyat jurnali
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Tizim amallari va admin faoliyatining xronologik oqimi
          </p>
        </div>

        {/* Clear trigger */}
        {logs.length > 0 && (
          <button
            type="button"
            onClick={handleClearLogs}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border-glass bg-background-secondary/20 text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 text-xs font-bold transition-all duration-200 active:scale-95 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            Jurnalni tozalash
          </button>
        )}
      </div>

      {/* Type filters tabs */}
      <div className="flex flex-wrap bg-background-secondary/50 border border-border-glass/50 p-1 rounded-xl w-full sm:w-auto shrink-0 select-none">
        {(["Hammasi", "pc", "order", "product", "system"] as LogTypeFilter[]).map((filter) => {
          const label =
            filter === "Hammasi"
              ? "Barchasi"
              : filter === "pc"
              ? "Kompyuter"
              : filter === "order"
              ? "Buyurtmalar"
              : filter === "product"
              ? "Mahsulotlar"
              : "Tizim";

          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-95 whitespace-nowrap",
                selectedFilter === filter
                  ? "bg-accent-primary text-white shadow-accent-glow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Feed list */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="glass-card border border-border-glass/40 bg-background-secondary/35 p-12 text-center text-text-secondary/50 rounded-2xl">
            <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-50 stroke-1" />
            <p className="text-xs font-semibold">Tegishli yozuvlar topilmadi</p>
            <p className="text-[10px] opacity-75 mt-0.5">Hozircha jurnal tarixi bo&apos;sh turibdi.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <ActivityLogItem key={log.id} log={log} />
          ))
        )}
      </div>
    </main>
  );
}
