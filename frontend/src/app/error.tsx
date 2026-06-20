"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error("Xatolik yuz berdi:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-primary px-4 text-center">
      <h1 className="font-heading text-5xl font-extrabold text-status-occupied sm:text-6xl">
        Xatolik!
      </h1>
      <h2 className="mt-4 font-heading text-xl font-bold text-text-primary sm:text-2xl">
        Nimadir xato ketdi
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary sm:text-base">
        Kutilmagan xatolik yuz berdi. Tizimni qayta yuklashga urinib ko&apos;ring.
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <Button 
          onClick={() => reset()} 
          className="active:scale-95 transition-transform duration-150 shadow-accent-glow"
        >
          Qayta urinish
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = "/"}
          className="active:scale-95 transition-transform duration-150"
        >
          Bosh sahifa
        </Button>
      </div>
    </div>
  );
}
