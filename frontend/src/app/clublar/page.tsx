"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, ChevronDown, Filter } from "lucide-react";
import dynamic from "next/dynamic";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

import { MOCK_CLUBS, REGIONS, DISTRICTS } from "@/lib/mock-data";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { shouldAnimate, isDesktop } = useDesktopAnimation();
  
  // Basic filtering based on search query and region/district
  const filteredClubs = MOCK_CLUBS.filter(club => {
    const matchSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || club.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRegion = selectedRegion ? club.viloyat === selectedRegion : true;
    const matchDistrict = selectedDistrict ? club.tuman === selectedDistrict : true;
    return matchSearch && matchRegion && matchDistrict;
  });

  const availableDistricts = selectedRegion ? DISTRICTS[selectedRegion] || [] : [];

  return (
    <div className="min-h-screen text-text-primary flex flex-col relative md:bg-stripe-gradient bg-background-primary md:bg-transparent">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="light" />
        </Suspense>
      )}
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden pt-16">
        {/* Left Sidebar - Profiles/Clubs List */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-border-primary bg-background-primary h-full z-10 shadow-xl">
          <div className="p-4 border-b border-border-primary">
            <h1 className="font-heading text-xl font-bold mb-4">
              <span className="gradient-text">Game clublar va Profillar</span>
            </h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Klub yoki ism bo'yicha qidirish..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background-secondary border border-border-primary rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-text-primary placeholder:text-text-secondary"
              />
            </div>
            
            {/* Region Filters */}
            <div className="flex gap-2">
              <select 
                className="flex-1 appearance-none bg-background-secondary border border-border-primary rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-accent-primary text-text-primary"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedDistrict("");
                }}
              >
                <option value="">Barcha viloyatlar</option>
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              
              <select 
                className="flex-1 appearance-none bg-background-secondary border border-border-primary rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-accent-primary text-text-primary disabled:opacity-50"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedRegion || availableDistricts.length === 0}
              >
                <option value="">Tumanlar</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club, index) => (
                <div key={club.id} className="flex gap-4 p-3 rounded-xl border border-border-primary bg-background-secondary hover:border-accent-primary hover:bg-background-tertiary transition-all cursor-pointer group">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
                    <Image 
                      src={club.image} 
                      alt={club.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading text-sm font-bold text-text-primary line-clamp-1">{club.name}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3 w-3 fill-accent-primary text-accent-primary" />
                        <span className="text-xs font-bold">{club.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{club.tuman}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-semibold text-accent-primary">{club.price}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-status-online px-2 py-0.5 rounded-full bg-status-online/10">
                        {club.availableSeats} BO'SH
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-text-secondary text-sm">
                Ma'lumot topilmadi
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Map Area */}
        <div className="flex-1 relative bg-[#0B0F19] overflow-hidden hidden md:block">
          {/* Simulated Map Background (Dark Grid) */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#22D3EE 1px, transparent 1px), linear-gradient(90deg, #22D3EE 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <MapPin className="h-16 w-16 text-accent-primary/50 mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-text-secondary opacity-50 font-heading">Interaktiv Xarita qismi</h2>
            <p className="text-sm text-text-secondary opacity-50 mt-2">Bu yerda haqiqiy xarita ko'rinadi (Leaflet/Google Maps)</p>
          </div>

          {/* Simulated Map Markers */}
          {filteredClubs.slice(0, 5).map((club, i) => (
            <div key={club.id} className="absolute z-10 flex flex-col items-center group cursor-pointer" style={{ top: `${20 + i * 15}%`, left: `${30 + (i % 3) * 20}%` }}>
              <div className="bg-background-secondary border border-accent-primary rounded-lg p-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                <p className="text-xs font-bold text-text-primary">{club.name}</p>
                <p className="text-[10px] text-accent-primary">{club.availableSeats} joy bo'sh</p>
              </div>
              <div className="relative">
                <span className="absolute -inset-1 rounded-full bg-accent-primary/40 animate-ping"></span>
                <div className="relative h-6 w-6 bg-accent-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ))}

          {/* User/Referral Markers */}
          <div className="absolute z-10 flex flex-col items-center group cursor-pointer" style={{ top: '60%', left: '40%' }}>
            <div className="bg-background-secondary border border-green-500 rounded-lg p-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
              <p className="text-xs font-bold text-text-primary">Alisher (Sizning referal)</p>
              <p className="text-[10px] text-green-400">Hozir o'yinda</p>
            </div>
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-green-500/40 animate-ping"></span>
              <div className="relative h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 bg-background-secondary/80 backdrop-blur border border-border-primary rounded-xl p-4 shadow-xl z-20 pointer-events-auto">
             <h4 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wider">Xarita belgilari</h4>
             <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 bg-accent-primary rounded-full border border-white"></div>
                <span className="text-xs text-text-secondary">Game Clublar</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full border border-white"></div>
                <span className="text-xs text-text-secondary">Sizning referallaringiz</span>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
