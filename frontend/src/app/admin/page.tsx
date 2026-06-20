"use client";

import { useEffect, useState } from "react";
import { 
  Monitor, 
  MonitorOff, 
  Coins, 
  AlertTriangle, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Timer 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_COMPUTERS, MOCK_ORDERS, Computer, Order } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setComputers(MOCK_COMPUTERS);
    setOrders(MOCK_ORDERS);
  }, []);

  // Compute stats
  const occupiedCount = computers.filter(c => c.status === "occupied" || c.status === "ending_soon").length;
  const freeCount = computers.filter(c => c.status === "free").length;
  const totalCount = computers.length;
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

  // Recent orders (3-4 items)
  const recentOrders = orders.slice(0, 4);

  // Attention required: PCs with ending_soon status or remaining time < 10 mins (600s)
  const attentionRequiredPcs = computers.filter(c => c.status === "ending_soon");

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Boshqaruv Paneli
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Klubning joriy holati va tezkor hisobotlar
        </p>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Band PCs */}
        <Card className="border-border-glass bg-background-secondary/30 glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
                Band kompyuterlar
              </span>
              <p className="text-xl sm:text-2xl font-heading font-extrabold text-status-occupied">
                {occupiedCount} / {totalCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-status-occupied/10 text-status-occupied flex items-center justify-center">
              <Monitor className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Free PCs */}
        <Card className="border-border-glass bg-background-secondary/30 glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
                Bo&apos;sh kompyuterlar
              </span>
              <p className="text-xl sm:text-2xl font-heading font-extrabold text-status-free">
                {freeCount} / {totalCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-status-free/10 text-status-free flex items-center justify-center">
              <MonitorOff className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="border-border-glass bg-background-secondary/30 glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
                Bugungi daromad
              </span>
              <p className="text-xl sm:text-2xl font-heading font-extrabold text-accent-glow">
                1,250,000 so&apos;m
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-accent-glow/10 text-accent-glow flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="border-border-glass bg-background-secondary/30 glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
                Kutilayotgan buyurtmalar
              </span>
              <p className="text-xl sm:text-2xl font-heading font-extrabold text-status-ending">
                {pendingOrdersCount} ta
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-status-ending/10 text-status-ending flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Orders and Attention List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Orders (2 Columns on Large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border-glass bg-background-secondary/40 glass-card">
            <CardHeader className="pb-3 border-b border-border-glass/30">
              <CardTitle className="text-sm sm:text-base font-heading flex items-center gap-2">
                <ShoppingCart className="h-4.5 w-4.5 text-accent-glow" />
                So&apos;nggi buyurtmalar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border-glass/20 bg-background-primary/30 text-text-secondary text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">ID</th>
                      <th className="p-3">Kompyuter</th>
                      <th className="p-3">Mahsulotlar</th>
                      <th className="p-3 text-right">Summa</th>
                      <th className="p-3 text-center">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-glass/10">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-background-primary/10 transition-colors">
                        <td className="p-3 font-semibold text-text-secondary">#{order.id}</td>
                        <td className="p-3 font-bold text-text-primary">PC {order.computerNumber}</td>
                        <td className="p-3 truncate max-w-[200px] text-text-secondary">
                          {order.items.map(item => `${item.name} (${item.qty})`).join(", ")}
                        </td>
                        <td className="p-3 text-right font-bold text-accent-glow">
                          {(order.total || 0).toLocaleString()} so&apos;m
                        </td>
                        <td className="p-3 text-center">
                          <span 
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              order.status === "pending"
                                ? "bg-status-occupied/10 text-status-occupied border border-status-occupied/20"
                                : order.status === "preparing"
                                ? "bg-status-ending/10 text-status-ending border border-status-ending/20"
                                : "bg-status-free/10 text-status-free border border-status-free/20"
                            )}
                          >
                            {order.status === "pending" 
                              ? "kutilmoqda" 
                              : order.status === "preparing" 
                              ? "tayyorlanmoqda" 
                              : "yetkazildi"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attention Required Section */}
        <div className="space-y-4">
          <Card className="border-border-glass bg-background-secondary/40 glass-card">
            <CardHeader className="pb-3 border-b border-border-glass/30">
              <CardTitle className="text-sm sm:text-base font-heading flex items-center gap-2 text-status-ending">
                <AlertTriangle className="h-4.5 w-4.5" />
                Diqqat talab qilinadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {attentionRequiredPcs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-text-secondary">
                  <CheckCircle2 className="h-8 w-8 text-status-free mb-2" />
                  <p className="text-xs font-semibold">Barcha o&apos;rinlar yaxshi</p>
                  <p className="text-[10px] opacity-75">Vaqti tugayotgan kompyuterlar yo&apos;q.</p>
                </div>
              ) : (
                attentionRequiredPcs.map((pc) => (
                  <div 
                    key={pc.id} 
                    className="flex items-start gap-3 p-3 rounded-lg border border-status-ending/20 bg-status-ending/5"
                  >
                    <Timer className="h-4.5 w-4.5 text-status-ending shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-primary">
                          PC {pc.number} ({pc.zone})
                        </span>
                        <span className="text-[10px] font-bold text-status-ending uppercase bg-status-ending/10 px-1.5 py-0.5 rounded">
                          {Math.floor(pc.remainingSeconds / 60)} daq.
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-relaxed">
                        Foydalanuvchi: <span className="font-bold text-text-primary">{pc.customerName}</span>. 
                        Vaqti tugashiga oz qoldi.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
