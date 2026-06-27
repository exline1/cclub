"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  validateEmailOrPhone,
  validatePassword,
} from "@/lib/validation";

interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("phone");
  const [role, setRole] = useState<"mijoz" | "klub">("mijoz");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMethodChange = (method: "email" | "phone") => {
    setLoginMethod(method);
    setIdentifier(method === "phone" ? "+998" : "");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let identifierValid = false;
    let identifierMessage = "";

    if (loginMethod === "email") {
      const emailResult = validateEmail(identifier);
      identifierValid = emailResult.isValid;
      identifierMessage = emailResult.message || "";
    } else {
      // Phone validation (simple check)
      const phoneClean = identifier.replace(/[\s()-]/g, "");
      if (!phoneClean || phoneClean === "+998" || phoneClean.length < 9) {
        identifierValid = false;
        identifierMessage = "Telefon raqamini to'liq kiriting";
      } else {
        identifierValid = true;
      }
    }

    const passwordResult = validatePassword(password);

    const newErrors: LoginFormErrors = {};

    if (!identifierValid) {
      newErrors.identifier = identifierMessage;
    }
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Import qilinmagan bo'lsa next-auth ni chaqirish
      const { signIn, getSession } = await import("next-auth/react");

      const res = await signIn("credentials", {
        redirect: false,
        identifier: loginMethod === "email" ? identifier : identifier.replace(/[\s()-]/g, ""),
        password,
      });

      if (res?.error) {
        if (res.error === "PENDING_APPROVAL") {
          toast.error("Ruxsat etilmadi", {
            description: "Arizangiz hali ko'rib chiqilmoqda. Iltimos kuting.",
          });
        } else if (res.error.startsWith("APPLICATION_REJECTED")) {
          const reason = res.error.split(":")[1] || "Noma'lum sabab";
          toast.error("Ariza rad etildi", {
            description: `Arizangiz rad etildi. Sabab: ${reason}`,
          });
        } else {
          toast.error("Xatolik", {
            description: res.error || "Parol yoki login noto'g'ri",
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Sessiyani olish orqali role ni tekshirish
      const session = await getSession();

      toast.success("Muvaffaqiyatli!", {
        description: "Tizimga kirildi. Kabinetga yo'naltirilmoqdasiz...",
      });

      // Role bo'yicha yo'naltirish
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else if (session?.user?.role === "CLUB_OWNER") {
        router.push("/klub-panel");
      } else {
        router.push(returnUrl || "/dashboard");
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Tez orada", {
      description: "Google bilan kirish keyingi bosqichda qo'shiladi.",
    });
  };

  return (
    <AuthCard
      title="Xush kelibsiz"
      subtitle="cclub hisobingizga kiring"
    >
      {/* Role Toggle */}
      <div className="mb-6 flex rounded-3xl bg-background-tertiary p-1 border border-border-primary">
        <button
          type="button"
          className={`flex-1 rounded-3xl py-2 text-sm font-bold transition-all duration-200 ${
            role === "mijoz"
              ? "bg-accent-primary text-white shadow-md"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setRole("mijoz")}
        >
          Mijoz
        </button>
        <button
          type="button"
          className={`flex-1 rounded-3xl py-2 text-sm font-bold transition-all duration-200 ${
            role === "klub"
              ? "bg-accent-primary text-white shadow-md"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setRole("klub")}
        >
          Klub egasi
        </button>
      </div>

      {/* Login Method Toggle */}
      <div className="mb-6 flex rounded-3xl bg-background-primary p-1 border border-border-glass">
        <button
          type="button"
          className={`flex-1 rounded-3xl py-1.5 text-xs font-bold transition-all duration-200 ${
            loginMethod === "phone"
              ? "bg-accent-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => handleMethodChange("phone")}
        >
          Telefon orqali
        </button>
        <button
          type="button"
          className={`flex-1 rounded-3xl py-1.5 text-xs font-bold transition-all duration-200 ${
            loginMethod === "email"
              ? "bg-accent-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => handleMethodChange("email")}
        >
          Email orqali
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {loginMethod === "phone" ? (
          <FormField
            id="phone"
            label="Telefon raqam"
            error={errors.identifier}
          >
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="+998 90 123 45 67"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors((prev) => ({ ...prev, identifier: undefined }));
              }}
              autoFocus
              autoComplete="tel"
            />
          </FormField>
        ) : (
          <FormField
            id="email"
            label="Email manzili"
            error={errors.identifier}
          >
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors((prev) => ({ ...prev, identifier: undefined }));
              }}
              autoFocus
              autoComplete="email"
            />
          </FormField>
        )}

        <FormField id="password" label="Parol" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              autoComplete="current-password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-200 hover:text-text-primary h-8 w-8 flex items-center justify-center rounded-full"
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-text-secondary select-none">
              Eslab qol
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs text-accent-glow transition-colors duration-200 hover:text-accent-primary"
          >
            Parolni unutdingizmi?
          </Link>
        </div>

        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Kirilmoqda...
            </>
          ) : (
            "Kirish"
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
