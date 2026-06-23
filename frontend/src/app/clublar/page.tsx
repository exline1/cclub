"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, ChevronDown, Filter } from "lucide-react";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data for Clubs
const MOCK_CLUBS = [
  {
    id: "1",
    name: "Cyber Arena VIP",
    address: "Yunusobod tumani, 19-kvartal",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4080", "24/7", "PS5 xonasi"],
    availableSeats: 12,
    price: "15,000 so'm/soat",
  },
  {
    id: "2",
    name: "Nexus Gaming Lounge",
    address: "Chilonzor tumani, Muqimiy ko'chasi",
    distance: "3.5 km",
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    tags: ["RTX 3060", "Bar menyu", "VIP zonalar"],
    availableSeats: 0,
    price: "10,000 so'm/soat",
  },
  {
    id: "3",
    name: "Matrix eSports Center",
    address: "Mirzo Ulug'bek tumani, TTZ",
    distance: "5.1 km",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4090", "Streamer xonasi", "Oziq-ovqat"],
    availableSeats: 4,
    price: "20,000 so'm/soat",
  },
  {
    id: "4",
    name: "GameHub Tashkent",
    address: "Shayxontohur tumani, Navoiy ko'chasi",
    distance: "2.8 km",
    rating: 4.2,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    tags: ["GTX 1660", "Arzon", "24/7 emas"],
    availableSeats: 25,
    price: "8,000 so'm/soat",
  },
  {
    id: "5",
    name: "LevelUp Cyberclub",
    address: "Yakkasaroy tumani, Shota Rustaveli",
    distance: "4.0 km",
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4070", "Lounge", "Kalyan"],
    availableSeats: 8,
    price: "18,000 so'm/soat",
  },
];

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Basic filtering based on search query
  const filteredClubs = MOCK_CLUBS.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
              Barcha game clublar
            </h1>
            <p className="mt-2 text-text-secondary">
              Shahringizdagi eng yaxshi kompyuter klublarini toping va joy band qiling.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-20 z-30 bg-background-primary/95 backdrop-blur-md py-4 border-b border-border-primary">
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
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
              <button className="flex items-center gap-2 whitespace-nowrap bg-background-secondary border border-border-primary rounded-xl px-4 py-3 text-sm font-medium hover:bg-background-tertiary transition-colors">
                <MapPin className="h-4 w-4 text-accent-secondary" />
                Toshkent
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <button className="flex items-center gap-2 whitespace-nowrap bg-background-secondary border border-border-primary rounded-xl px-4 py-3 text-sm font-medium hover:bg-background-tertiary transition-colors">
                Eng yaqin
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <button className="flex items-center gap-2 whitespace-nowrap bg-background-secondary border border-border-primary rounded-xl px-4 py-3 text-sm font-medium hover:bg-background-tertiary transition-colors">
                <Filter className="h-4 w-4" />
                Filtrlar
              </button>
            </div>
          </div>

          {/* Clubs Grid */}
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club, index) => (
                <div 
                  key={club.id} 
                  className="group flex flex-col bg-background-secondary border border-border-primary rounded-[24px] overflow-hidden hover:border-accent-primary/50 transition-all duration-300 hover:shadow-accent-glow-sm hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                        <Star className="h-3.5 w-3.5 fill-accent-secondary text-accent-secondary" />
                        <span className="text-sm font-bold text-text-primary">{club.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{club.address}</span>
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
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
              <div className="h-24 w-24 bg-background-tertiary rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Klublar topilmadi</h3>
              <p className="text-text-secondary max-w-md">
                Kiritilgan qidiruv so'roviga mos klublar afsuski topilmadi. Boshqa shahar yoki nom bilan qidirib ko'ring.
              </p>
              <Button variant="outline" className="mt-6 border-border-primary" onClick={() => setSearchQuery("")}>
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
