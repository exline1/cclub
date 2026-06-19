"use client";

import { Calendar, Edit3, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserCabinetProps {
  name: string;
  phone: string;
  joinDate: string;
}

export function UserCabinet({ name, phone, joinDate }: UserCabinetProps) {
  const handleEdit = () => {
    toast.info("Tez orada", {
      description: "Profilni tahrirlash funksiyasi Faza 2-da qo'shiladi.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 border-b border-border-glass/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-accent-glow" />
            Mening kabinetim
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 text-xs text-accent-glow hover:text-accent-primary"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Tahrirlash
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
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
      </CardContent>
    </Card>
  );
}
