"use client";

import Link from "next/link";
import { Coffee, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onOpenBooking: () => void;
  hasActiveSession: boolean;
}

export function QuickActions({ onOpenBooking, hasActiveSession }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
      {/* Book seat card */}
      <Card className="hover:border-accent-glow hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-deep text-accent-glow">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <CardTitle className="text-base sm:text-lg">Joy band qilish</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Klubdagi bo&apos;sh o&apos;rinlardan birini o&apos;zingizga tezda bron qiling.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button 
            onClick={onOpenBooking} 
            className="w-full text-xs sm:text-sm"
            disabled={hasActiveSession}
          >
            {hasActiveSession ? "Sizda faol sessiya bor" : "Hozir band qilish"}
          </Button>
        </CardContent>
      </Card>

      {/* Bar Menu Card */}
      <Card className="hover:border-accent-glow hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-deep text-accent-glow">
            <Coffee className="h-5 w-5" />
          </div>
          <CardTitle className="text-base sm:text-lg">Bar menyu</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            O&apos;yin davomida salqin ichimliklar va mazali gazaklar buyurtma bering.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button variant="secondary" asChild className="w-full text-xs sm:text-sm">
            <Link href="/menu">Menyuga o&apos;tish</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
