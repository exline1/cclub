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
const Pricing = dynamic(() =>
  import("@/components/landing/Pricing").then((mod) => mod.Pricing)
);
const FAQ = dynamic(() =>
  import("@/components/landing/FAQ").then((mod) => mod.FAQ)
);
const DownloadCTA = dynamic(() =>
  import("@/components/landing/DownloadCTA").then((mod) => mod.DownloadCTA)
);
const Footer = dynamic(() =>
  import("@/components/landing/Footer").then((mod) => mod.Footer)
);

export default function HomePage() {
  return (
    <main className="bg-background-primary text-text-primary min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <BenefitCards />
      <Pricing />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
