import { cn } from "@/lib/utils";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Auth sahifalari uchun markazlashgan glassmorphism card.
 * backdrop-blur faqat shu kichik elementda ishlatiladi.
 */
export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "glass-card w-full max-w-md rounded-2xl border border-border-glass p-6 shadow-lg sm:p-8",
        className
      )}
    >
      <div className="mb-6 space-y-2 text-center sm:mb-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-text-secondary sm:text-base">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
