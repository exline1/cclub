"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, ChevronDown, Filter } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, slideInLeft, staggerContainer, cardHover, viewportOnce } from "@/lib/animations";

import { MOCK_CLUBS, REGIONS, DISTRICTS } from "@/lib/mock-data";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { shouldAnimate } = useDesktopAnimation();
  
  // Basic filtering based on search query and region/district
  const filteredClubs = MOCK_CLUBS.filter(club => {
    const matchSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || club.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRegion = selectedRegion ? club.viloyat === selectedRegion : true;
    const matchDistrict = selectedDistrict ? club.tuman === selectedDistrict : true;
    return matchSearch && matchRegion && matchDistrict;
  });

  const availableDistricts = selectedRegion ? DISTRICTS[selectedRegion] || [] : [];

  const Header = shouldAnimate ? motion.div : "div";
  const headerProps = shouldAnimate
    ? { variants: fadeUp, initial: "hidden", animate: "visible" }
    : {};

  const FilterBar = shouldAnimate ? motion.div : "div";
  const filterBarProps = shouldAnimate
    ? { variants: slideInLeft, initial: "hidden", animate: "visible" }
    : {};

  const Grid = shouldAnimate ? motion.div : "div";
  const gridProps = shouldAnimate
    ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce }
    : {};

  const Card = shouldAnimate ? motion.div : "div";

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col relative">
      <Suspense fallback={null}>
        <SceneWrapper variant="light" />
      </Suspense>
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <Header
            {...headerProps}
            className={cn(
              "mb-10",
              !shouldAnimate && "animate-in fade-in slide-in-from-bottom-4 duration-500"
            )}
          >
            <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
              Barcha game clublar
            </h1>
            <p className="mt-2 text-text-secondary">
              Shahringizdagi eng yaxshi kompyuter klublarini toping va joy band qiling.
            </p>
          </Header>

          {/* Filters & Search */}
          <FilterBar
            {...filterBarProps}
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-20 z-30 bg-background-primary/95 backdrop-blur-md py-4 border-b border-border-primary"
          >
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Klub nomi yoki manzil bo'yicha qidirish..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background-secondary border border-border-primary rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder:text-text-secondary"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <div className="relative min-w-[160px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-primary" />
                <select 
                  className="w-full appearance-none bg-background-secondary border border-border-primary rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors cursor-pointer text-text-primary"
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedDistrict(""); // Reset district when region changes
                  }}
                >
                  <option value="">Barcha viloyatlar</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
              </div>
              
              <div className="relative min-w-[160px]">
                <select 
                  className="w-full appearance-none bg-background-secondary border border-border-primary rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors cursor-pointer text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedRegion || availableDistricts.length === 0}
                >
                  <option value="">Barcha tumanlar</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
              </div>
              
              {(searchQuery || selectedRegion || selectedDistrict) && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRegion("");
                    setSelectedDistrict("");
                  }}
                  className="flex items-center justify-center whitespace-nowrap bg-background-tertiary border border-border-primary rounded-xl px-4 py-3 text-sm font-medium hover:bg-background-secondary hover:text-accent-primary transition-colors text-text-secondary"
                >
                  Tozalash
                </button>
              )}
            </div>
          </FilterBar>

          {/* Clubs Grid */}
          {filteredClubs.length > 0 ? (
            <Grid {...gridProps} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club, index) => {
                const cardMotionProps = shouldAnimate
                  ? { variants: fadeUp, whileHover: cardHover }
                  : {};

                return (
                  <Card 
                    key={club.id} 
                    {...cardMotionProps}
                    className={cn(
                      "group flex flex-col bg-background-secondary border border-border-primary rounded-[24px] overflow-hidden hover:border-accent-primary/50 transition-all duration-300 hover:shadow-accent-glow-sm",
                      !shouldAnimate && "animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                    )}
                    style={!shouldAnimate ? { animationDelay: `${index * 100}ms` } : undefined}
                  >
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-background-tertiary">
                      <Image 
                        src={club.image} 
                        alt={club.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-transparent to-transparent opacity-80" />
                      
                      {/* Live Status Badge */}
                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                        <span className="relative flex h-2.5 w-2.5">
                          {club.availableSeats > 0 ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-online"></span>
                            </>
                          ) : (
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-occupied"></span>
                          )}
                        </span>
                        <span className="font-mono text-xs font-semibold tracking-wider text-white">
                          {club.availableSeats > 0 ? `${club.availableSeats} JOY BO'SH` : "BAND"}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 right-4 bg-background-secondary/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border-primary text-sm font-bold text-text-primary">
                        {club.price}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading text-xl font-bold text-text-primary line-clamp-1" title={club.name}>
                          {club.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-background-tertiary px-2 py-1 rounded-md shrink-0">
                          <Star className="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
                          <span className="text-sm font-bold text-text-primary">{club.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{club.viloyat}, {club.tuman}</span>
                        <span className="shrink-0 font-medium text-accent-primary">• {club.distance}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {club.tags.map(tag => (
                          <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-background-tertiary text-text-secondary border border-border-primary">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border-primary/50">
                        <Button asChild className="w-full bg-accent-primary hover:bg-accent-glow transition-all rounded-xl h-12">
                          <Link href={`/clublar/${club.id}`}>
                            Batafsil
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Grid>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
              <div className="h-24 w-24 bg-background-tertiary rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Klublar topilmadi</h3>
              <p className="text-text-secondary max-w-md">
                Kiritilgan qidiruv so&apos;roviga mos klublar afsuski topilmadi. Boshqa shahar yoki nom bilan qidirib ko&apos;ring.
              </p>
              <Button variant="outline" className="mt-6 border-border-primary hover:bg-background-tertiary hover:text-text-primary" onClick={() => {
                setSearchQuery("");
                setSelectedRegion("");
                setSelectedDistrict("");
              }}>
                Filtrlarni tozalash
              </Button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
