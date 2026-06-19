import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/shared/Logo";

export const metadata = {
  title: "Ro'yxatdan o'tish — GameClub Hub",
  description: "GameClub Hub ga ro'yxatdan o'ting",
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-background-primary">
      <div
        className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center sm:justify-start">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center pb-8">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-text-secondary">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-accent-glow"
          >
            &larr; Bosh sahifaga qaytish
          </Link>
        </p>
      </div>
    </main>
  );
}
