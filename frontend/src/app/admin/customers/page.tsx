"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Landmark, UserCheck, HeartHandshake } from "lucide-react";
import { MOCK_CUSTOMERS, Customer } from "@/lib/admin-mock-data";
import CustomerDetailModal from "@/components/admin/customers/CustomerDetailModal";

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Standard mock list
    setCustomers(MOCK_CUSTOMERS);
    setIsMounted(true);
  }, []);

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // Filter
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.replace(/[^0-9+]/g, "").includes(query.replace(/[^0-9+]/g, ""))
    );
  });

  // Calculate Registry Stats
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const loyalCustomersCount = customers.filter((c) => c.totalSpent >= 800000).length;

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Mijozlar yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title & stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Mijozlar bazasi
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Ro&apos;yxatdan o&apos;tgan klub foydalanuvchilari va ularning faolligi
          </p>
        </div>

        {/* Stats summary row */}
        <div className="flex flex-wrap gap-2 sm:gap-3 bg-background-secondary/40 border border-border-glass/40 rounded-xl p-2 sm:p-3 glass-card">
          <div className="px-3 py-1 flex items-center gap-1.5 border-r border-border-glass/30 text-xs">
            <Landmark className="h-4 w-4 text-accent-glow" />
            <span className="text-text-secondary">
              Umumiy tushum: <strong className="text-text-primary font-bold">{(totalRevenue / 1000000).toFixed(2)}M UZS</strong>
            </span>
          </div>
          <div className="px-3 py-1 flex items-center gap-1.5 text-xs">
            <UserCheck className="h-4 w-4 text-status-free" />
            <span className="text-text-secondary">
              Faol a&apos;zolar: <strong className="text-text-primary font-bold">{customers.length} ta</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Control Tools */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Ism yoki telefon bo'yicha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-secondary/30 border border-border-glass/65 rounded-xl pl-9 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-all"
          />
        </div>
        
        <span className="text-text-secondary text-[10px] sm:text-xs font-semibold self-center sm:self-auto">
          Jami: <strong className="text-text-primary">{filteredCustomers.length} ta mijoz</strong>
        </span>
      </div>

      {/* Grid table */}
      <div className="glass-card border border-border-glass/40 bg-background-secondary/30 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border-glass/30 bg-background-primary/40 text-text-secondary text-[10px] uppercase font-bold tracking-wider select-none">
                <th className="p-4 pl-6">Mijoz ismi</th>
                <th className="p-4">Telefon</th>
                <th className="p-4 text-center">A&apos;zo bo&apos;lgan sana</th>
                <th className="p-4 text-right">Jami to&apos;lov (Spent)</th>
                <th className="p-4 text-center">Oxirgi tashrif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass/10">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-text-secondary/55">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50 stroke-1" />
                    <p className="text-xs font-semibold">Mijozlar topilmadi</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Filtrlash so&apos;rovini o&apos;zgartirib ko&apos;ring.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const { id, name, phone, joinedAt, totalSpent, lastVisit } = customer;
                  const isLoyal = totalSpent >= 800000;

                  return (
                    <tr
                      key={id}
                      onClick={() => handleRowClick(customer)}
                      className="hover:bg-background-primary/20 transition-colors group cursor-pointer active:bg-background-primary/30"
                    >
                      {/* Name */}
                      <td className="p-4 pl-6 flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-xs sm:text-sm group-hover:text-accent-glow transition-colors">
                          {name}
                        </span>
                        {isLoyal && (
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-status-free bg-status-free/10 border border-status-free/20 px-1 py-0.2 rounded uppercase tracking-wide">
                            Loyal
                          </span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-text-secondary font-medium text-xs">
                        {phone}
                      </td>

                      {/* Joined date */}
                      <td className="p-4 text-center text-text-secondary text-xs">
                        {joinedAt}
                      </td>

                      {/* Spent */}
                      <td className="p-4 text-right font-bold text-accent-glow text-xs sm:text-sm">
                        {totalSpent.toLocaleString()} so&apos;m
                      </td>

                      {/* Last visit */}
                      <td className="p-4 text-center text-text-secondary text-xs">
                        {lastVisit}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer details modal */}
      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
    </main>
  );
}
