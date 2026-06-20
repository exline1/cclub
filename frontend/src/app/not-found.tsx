import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-primary px-4 text-center">
      <h1 className="font-heading text-6xl font-extrabold text-accent-glow sm:text-7xl animate-pulse">
        404
      </h1>
      <h2 className="mt-4 font-heading text-xl font-bold text-text-primary sm:text-2xl">
        Sahifa topilmadi
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary sm:text-base">
        Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko&apos;chirilgan bo&apos;lishi mumkin.
      </p>
      <div className="mt-8">
        <Button asChild className="active:scale-95 transition-transform duration-150 shadow-accent-glow">
          <Link href="/">Bosh sahifaga qaytish</Link>
        </Button>
      </div>
    </div>
  );
}
