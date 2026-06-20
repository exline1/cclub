"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateTermsAccepted,
} from "@/lib/validation";

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameResult = validateRequired(name, "Ism");
    const emailResult = email ? validateEmail(email) : { isValid: true };
    
    // Phone validation
    const phoneClean = phone.replace(/[\s()-]/g, "");
    const phoneValid = phoneClean && phoneClean !== "+998" && phoneClean.length >= 9;
    const phoneMessage = phoneValid ? "" : "Telefon raqamini to'liq kiriting";

    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordMatch(password, confirmPassword);
    const termsResult = validateTermsAccepted(termsAccepted);

    const newErrors: RegisterFormErrors = {};

    if (!nameResult.isValid) newErrors.name = nameResult.message;
    if (!emailResult.isValid) newErrors.email = emailResult.message;
    if (!phoneValid) newErrors.phone = phoneMessage;
    if (!passwordResult.isValid) newErrors.password = passwordResult.message;
    if (!confirmResult.isValid) newErrors.confirmPassword = confirmResult.message;
    if (!termsResult.isValid) newErrors.termsAccepted = termsResult.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const mockUser = {
      name,
      phone,
      email: email || "mehmon@cclub.uz",
      joinDate: "19-iyun, 2026-yil",
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.setItem("gameclub_user", JSON.stringify(mockUser));

    toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", {
      description: "Kabinetga yo'naltirilmoqdasiz...",
    });

    setIsSubmitting(false);
    router.push("/dashboard");
  };

  const handleGoogleRegister = () => {
    toast.info("Tez orada", {
      description: "Google bilan ro'yxatdan o'tish keyingi bosqichda qo'shiladi.",
    });
  };

  return (
    <AuthCard
      title="Ro'yxatdan o'tish"
      subtitle="cclub jamoasiga qo'shiling"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField id="name" label="Ism" error={errors.name}>
          <Input
            id="name"
            type="text"
            placeholder="Ismingiz"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            autoFocus
            autoComplete="name"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="phone" label="Telefon raqam" error={errors.phone}>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              autoComplete="tel"
            />
          </FormField>

          <FormField id="email" label="Email (Ixtiyoriy)" error={errors.email}>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
            />
          </FormField>
        </div>

        <FormField id="password" label="Parol" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Kamida 6 ta belgi"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete="new-password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-200 hover:text-text-primary h-8 w-8 flex items-center justify-center rounded-md"
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </FormField>

        <FormField
          id="confirmPassword"
          label="Parolni tasdiqlash"
          error={errors.confirmPassword}
        >
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Parolni qayta kiriting"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              autoComplete="new-password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-200 hover:text-text-primary h-8 w-8 flex items-center justify-center rounded-md"
              aria-label={showConfirmPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </FormField>

        <div className="space-y-2 pt-1">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => {
                setTermsAccepted(checked === true);
                setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
              }}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-xs font-normal leading-relaxed text-text-secondary select-none"
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

        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Kutilmoqda...
            </>
          ) : (
            "Ro'yxatdan o'tish"
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-glass" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background-secondary px-3 text-text-secondary">yoki</span>
          </div>
        </div>

        <Button
          type="button"
          variant="google"
          className="w-full flex items-center justify-center gap-2"
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
