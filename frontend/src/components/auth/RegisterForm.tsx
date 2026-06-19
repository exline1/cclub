"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateEmailOrPhone,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateTermsAccepted,
} from "@/lib/validation";

interface RegisterFormState {
  name: string;
  identifier: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface RegisterFormErrors {
  name?: string;
  identifier?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

export function RegisterForm() {
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof Omit<RegisterFormState, "termsAccepted">,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameResult = validateRequired(form.name, "Ism");
    const identifierResult = validateEmailOrPhone(form.identifier);
    const passwordResult = validatePassword(form.password);
    const confirmResult = validatePasswordMatch(
      form.password,
      form.confirmPassword
    );
    const termsResult = validateTermsAccepted(form.termsAccepted);

    const newErrors: RegisterFormErrors = {};

    if (!nameResult.isValid) newErrors.name = nameResult.message;
    if (!identifierResult.isValid) newErrors.identifier = identifierResult.message;
    if (!passwordResult.isValid) newErrors.password = passwordResult.message;
    if (!confirmResult.isValid) newErrors.confirmPassword = confirmResult.message;
    if (!termsResult.isValid) newErrors.termsAccepted = termsResult.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Muvaffaqiyatli!", {
      description: "Ro'yxatdan o'tish so'rovi qabul qilindi.",
    });
    setIsSubmitting(false);
  };

  const handleGoogleRegister = () => {
    toast.info("Tez orada", {
      description: "Google bilan ro'yxatdan o'tish keyingi bosqichda qo'shiladi.",
    });
  };

  return (
    <AuthCard
      title="Ro'yxatdan o'tish"
      subtitle="GameClub Hub jamoasiga qo'shiling"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField id="name" label="Ism" error={errors.name}>
          <Input
            id="name"
            type="text"
            placeholder="Ismingiz"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            autoComplete="name"
          />
        </FormField>

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
            autoComplete="email"
          />
        </FormField>

        <FormField id="password" label="Parol" error={errors.password}>
          <Input
            id="password"
            type="password"
            placeholder="Kamida 6 ta belgi"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            autoComplete="new-password"
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Parolni tasdiqlash"
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Parolni qayta kiriting"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            autoComplete="new-password"
          />
        </FormField>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={form.termsAccepted}
              onCheckedChange={(checked) => {
                setForm((prev) => ({
                  ...prev,
                  termsAccepted: checked === true,
                }));
                setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
              }}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm font-normal leading-relaxed text-text-secondary"
            >
              Foydalanish shartlari va maxfiylik siyosatiga roziman
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-status-occupied" role="alert">
              {errors.termsAccepted}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Kutilmoqda..." : "Ro'yxatdan o'tish"}
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
          onClick={handleGoogleRegister}
        >
          <GoogleIcon />
          Google bilan ro&apos;yxatdan o&apos;tish
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Akkountingiz bormi?{" "}
          <Link
            href="/login"
            className="font-bold text-accent-glow transition-colors duration-200 hover:text-accent-primary"
          >
            Kiring
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
