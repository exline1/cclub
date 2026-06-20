"use client";

import React from "react";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";

export default function SettingsAdminPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Tizim sozlamalari
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Klub tariflari, ish soatlari va aloqa ma&apos;lumotlarini boshqarish
        </p>
      </div>

      {/* Main Settings Tabs Accordion */}
      <SettingsTabs />
    </main>
  );
}
