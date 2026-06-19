import dynamic from "next/dynamic";

import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

// Below-the-fold bo'limlar lazy-load — birinchi yuklanish tezligi uchun
const About = dynamic(() =>
  import("@/components/landing/About").then((mod) => mod.About)
);
const Services = dynamic(() =>
  import("@/components/landing/Services").then((mod) => mod.Services)
);
const Zones = dynamic(() =>
  import("@/components/landing/Zones").then((mod) => mod.Zones)
);
const FAQ = dynamic(() =>
  import("@/components/landing/FAQ").then((mod) => mod.FAQ)
);
const Footer = dynamic(() =>
  import("@/components/landing/Footer").then((mod) => mod.Footer)
);

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Zones />
      <FAQ />
      <Footer />
    </main>
  );
}
