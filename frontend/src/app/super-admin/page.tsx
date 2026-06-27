import React from "react";
import { Users, LayoutGrid, DollarSign, Activity } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white">Platforma Statistikasi</h2>
        <p className="text-text-secondary mt-1">cClub platformasining umumiy holati</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Jami Klublar" value="12" icon={LayoutGrid} trend="+2 bu oy" />
        <StatCard title="Faol Mijozlar" value="1,248" icon={Users} trend="+124 bu oy" />
        <StatCard title="Umumiy Daromad" value="34M so'm" icon={DollarSign} trend="+12% bu oy" />
        <StatCard title="Faol Sessiyalar" value="45" icon={Activity} trend="Hozirgi vaqtda" />
      </div>

      {/* Placeholder for charts or recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-background-secondary border border-border-primary rounded-xl p-6 h-96 flex flex-col">
          <h3 className="font-bold text-white mb-4">Aktivlik Grafigi</h3>
          <div className="flex-1 border-2 border-dashed border-border-primary/50 rounded-lg flex items-center justify-center text-text-secondary">
            Grafik bu yerda bo'ladi
          </div>
        </div>
        <div className="bg-background-secondary border border-border-primary rounded-xl p-6 h-96 flex flex-col">
          <h3 className="font-bold text-white mb-4">So'nggi harakatlar</h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Mock recent activities */}
            <div className="flex gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-accent-primary"></div>
              <div>
                <p className="text-white">Yangi klub arizasi tushdi</p>
                <p className="text-text-secondary text-xs">10 daqiqa oldin</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-status-free"></div>
              <div>
                <p className="text-white">CyberSpace klubi tasdiqlandi</p>
                <p className="text-text-secondary text-xs">2 soat oldin</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-status-occupied"></div>
              <div>
                <p className="text-white">GG Zone arizasi rad etildi</p>
                <p className="text-text-secondary text-xs">Kecha, 14:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="bg-background-secondary border border-border-primary rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent-primary" />
        </div>
      </div>
      <div className="mt-4 text-xs font-medium text-text-secondary">
        {trend}
      </div>
    </div>
  );
}
