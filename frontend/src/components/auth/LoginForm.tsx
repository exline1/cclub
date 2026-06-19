"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  validateEmailOrPhone,
  validatePassword,
  validateRequired,
} from "@/lib/validation";

interface LoginFormState {
  identifier: string;
  password: string;
}

interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const [form, setForm] = useState<LoginFormState>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const identifierResult = validateEmailOrPhone(form.identifier);
    const passwordResult = validatePassword(form.password);

    const newErrors: LoginFormErrors = {};

    if (!identifierResult.isValid) {
      newErrors.identifier = identifierResult.message;
    }
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Backend hali yo'q — faqat UI demo
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Muvaffaqiyatli!", {
      description: "Tizimga kirish so'rovi qabul qilindi.",
    });
    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    toast.info("Tez orada", {
      description: "Google bilan kirish keyingi bosqichda qo'shiladi.",
    });
  };

  return (
    <AuthCard
      title="Xush kelibsiz"
      subtitle="GameClub Hub hisobingizga kiring"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          id="identifier"
          label="Email yoki telefon"
          error={errors.identifier}
        >
          <Input
            id="identifier"
            type="text"
            placeholder="email@example.com yoki +998901234567"
            value={form.identifier}
            onChange={(e) => handleChange("identifier", e.target.value)}
            autoComplete="username"
          />
        </FormField>

        <FormField id="password" label="Parol" error={errors.password}>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            autoComplete="current-password"
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            href="#"
            className="text-sm text-accent-glow transition-colors duration-200 hover:text-accent-primary"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Tez orada", {
                description: "Parolni tiklash funksiyasi keyingi bosqichda.",
              });
            }}
          >
            Parolni unutdingizmi?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Kutilmoqda..." : "Kirish"}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-glass" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-3 text-text-secondary">yoki</span>
          </div>
        </div>

        <Button
          type="button"
          variant="google"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          Google bilan kirish
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Akkountingiz yo&apos;qmi?{" "}
          <Link
            href="/register"
            className="font-bold text-accent-glow transition-colors duration-200 hover:text-accent-primary"
          >
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
