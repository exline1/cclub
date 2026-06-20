"use client";

import { ArrowRight, Calendar, Phone, User } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserCabinetProps {
  name: string;
  phone: string;
  joinDate: string;
}

export function UserCabinet({ name, phone, joinDate }: UserCabinetProps) {
  return (
    <Card className="mb-6 border-border-glass bg-background-secondary/40 glass-card">
      <CardHeader className="pb-3 border-b border-border-glass/40">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-heading">
          <User className="h-4.5 w-4.5 text-accent-glow" />
          Mening kabinetim
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-3.5 text-sm sm:text-base">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-text-secondary">Foydalanuvchi:</span>
            <span className="font-bold text-text-primary">{name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-text-secondary">Telefon raqam:</span>
            <span className="font-bold text-text-primary flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-text-secondary" />
              {phone}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-text-secondary">A&apos;zo bo&apos;lgan sana:</span>
            <span className="font-bold text-text-primary flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-text-secondary" />
              {joinDate}
            </span>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs border-border-glass hover:border-accent-glow text-accent-glow hover:text-accent-primary transition-all duration-200"
        >
          <Link href="/profile" className="flex items-center justify-center gap-1">
            Profilni ko&apos;rish
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
