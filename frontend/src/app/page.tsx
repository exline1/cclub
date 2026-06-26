"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

// Lazy loading below-the-fold components
const HowItWorks = dynamic(() =>
  import("@/components/landing/HowItWorks").then((mod) => mod.HowItWorks)
);
const BenefitCards = dynamic(() =>
  import("@/components/landing/BenefitCards").then((mod) => mod.BenefitCards)
);
const DownloadCTA = dynamic(() =>
  import("@/components/landing/DownloadCTA").then((mod) => mod.DownloadCTA)
);
const Footer = dynamic(() =>
  import("@/components/landing/Footer").then((mod) => mod.Footer)
);

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function HomePage() {
  return (
    <main className="bg-background-primary text-text-primary min-h-screen relative">
      <Suspense fallback={null}>
        <SceneWrapper variant="hero" />
      </Suspense>
      <Navbar />
      <Hero />
      <HowItWorks />
      <BenefitCards />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
