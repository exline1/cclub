"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setError(emailResult.message);
      return;
    }

    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Muvaffaqiyatli!", {
      description: "Agar bu email tizimda bo'lsa, parolni tiklash havolasi yuborildi.",
    });

    setIsSubmitting(false);
    setEmail("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-primary px-4 py-12">
      <AuthCard title="Parolni tiklash">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <p className="text-xs sm:text-sm text-text-secondary text-center leading-relaxed">
            Ro&apos;yxatdan o&apos;tgan email manzilingizni kiriting va biz sizga parolni tiklash havolasini yuboramiz.
          </p>

          <FormField id="email" label="Email manzili" error={error}>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(undefined);
              }}
              autoFocus
              required
            />
          </FormField>

          <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              "Yuborish"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Tizimga kirishga qaytish
            </Link>
          </div>
        </form>
      </AuthCard>
    </main>
  );
}
