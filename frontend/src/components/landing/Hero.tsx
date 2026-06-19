import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { IMAGE_PATHS } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-16">
      {/* Statik gradient fon — past quvvatli qurilmalar uchun yengil */}
      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />

      {/* Rasm placeholder — public/images/hero-bg.jpg ni almashtiring */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src={IMAGE_PATHS.heroBg}
          alt="Zamonaviy gaming klub interyeri"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay — matn o'qilishini yaxshilash */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background-primary/60 via-background-primary/80 to-background-primary"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-glow sm:text-sm">
          Gaming Arena
        </p>

        <h1 className="font-heading max-w-4xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          O&apos;yinga sho&apos;ng&apos;i,{" "}
          <span className="text-accent-glow">qolganini bizga qo&apos;y</span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm text-text-secondary sm:text-base lg:text-lg">
          GameClub Hub — kompyuter o&apos;yinlari markazlari uchun tezkor buyurtma,
          onlayn vaqt nazorati va premium o&apos;yin zonalari bitta platformada.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/login">Kirish</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
