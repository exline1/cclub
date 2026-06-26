"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { Settings, LogOut, LayoutDashboard, Users, Monitor, BarChart } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function KlubPanelPage() {
  const { isDesktop } = useDesktopAnimation();

  useEffect(() => {
    document.title = "Klub Panel — CClub";
  }, []);

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col relative md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading text-3xl font-bold">Klub boshqaruv paneli</h1>
            <Button variant="outline" asChild className="border-border-primary hover:bg-background-tertiary">
              <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
                <LogOut className="h-4 w-4" />
                Chiqish
              </Link>
            </Button>
          </div>
          
          <div className="bg-background-secondary border border-border-primary rounded-[24px] p-8 text-center sm:p-16">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-primary/10 text-accent-primary mb-6 animate-pulse">
              <Settings className="h-10 w-10" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-4">Tez orada ishga tushadi</h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              Klubingizni boshqarish, buyurtmalarni kuzatish va statistikani ko'rish imkoniyati tez orada taqdim etiladi. Tizimimizni yangilayapmiz.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-background-tertiary p-4 rounded-xl border border-border-primary flex flex-col items-center opacity-50">
                <LayoutDashboard className="h-6 w-6 text-text-secondary mb-2" />
                <span className="text-sm font-medium">Asosiy panel</span>
              </div>
              <div className="bg-background-tertiary p-4 rounded-xl border border-border-primary flex flex-col items-center opacity-50">
                <Monitor className="h-6 w-6 text-text-secondary mb-2" />
                <span className="text-sm font-medium">Kompyuterlar</span>
              </div>
              <div className="bg-background-tertiary p-4 rounded-xl border border-border-primary flex flex-col items-center opacity-50">
                <Users className="h-6 w-6 text-text-secondary mb-2" />
                <span className="text-sm font-medium">Mijozlar</span>
              </div>
              <div className="bg-background-tertiary p-4 rounded-xl border border-border-primary flex flex-col items-center opacity-50">
                <BarChart className="h-6 w-6 text-text-secondary mb-2" />
                <span className="text-sm font-medium">Hisobotlar</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
