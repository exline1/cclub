"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Star, Monitor, Gamepad2, Clock, Wallet, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { MOCK_CLUBS } from "@/lib/mock-data";

export default function ClubProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const club = MOCK_CLUBS.find(c => c.id === id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  if (!club) {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Klub topilmadi</h1>
          <Button asChild>
            <Link href="/clublar">Klublarga qaytish</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone || !bookingDate || !bookingTime) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    
    setIsModalOpen(false);
    toast.success("Joy muvaffaqiyatli band qilindi!", {
      description: `${bookingDate} kuni soat ${bookingTime} ga ${club.zones.find(z => z.id === selectedZone)?.name} zonasiga buyurtmangiz qabul qilindi.`,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Iltimos, baho bering");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Iltimos, sharh matnini kiriting");
      return;
    }
    
    toast.success("Sharhingiz qabul qilindi!", {
      description: "Fikringiz uchun rahmat. U tez orada ko'rinadi.",
    });
    setRating(0);
    setReviewText("");
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <Link href="/clublar" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Klublarga qaytish</span>
          </Link>

          {/* Hero Section */}
          <div className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-[32px] overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Image 
              src={club.image} 
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-status-online"></span>
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-wider text-white">
                      OCHIQ
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-background-tertiary/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border-primary/50">
                    <Star className="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
                    <span className="text-sm font-bold text-white">{club.rating}</span>
                    <span className="text-xs text-text-secondary">({club.reviewsCount} sharh)</span>
                  </div>
                </div>
                
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
                  {club.name}
                </h1>
                
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-4.5 w-4.5 text-accent-primary shrink-0" />
                  <span>{club.address} • {club.distance}</span>
                </div>
              </div>
              
              <Button onClick={() => setIsModalOpen(true)} className="h-14 px-8 rounded-xl bg-accent-primary hover:bg-accent-glow text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all shrink-0">
                Joy band qilish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Info & Zones */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Info Grid */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Monitor className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Kompyuterlar</span>
                  <span className="font-bold text-lg">{club.zones.reduce((acc, z) => acc + z.computersCount, 0)} ta</span>
                </div>
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Gamepad2 className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Zonalar</span>
                  <span className="font-bold text-lg">{club.zones.length} ta</span>
                </div>
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Ish vaqti</span>
                  <span className="font-bold text-lg">{club.workingHours}</span>
                </div>
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Boshlang'ich narx</span>
                  <span className="font-bold text-lg">{club.price.split('/')[0]}</span>
                </div>
              </section>

              {/* Zones Section */}
              <section className="animate-in fade-in slide-in-from-bottom-8">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-accent-primary" />
                  Mavjud zonalar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {club.zones.map(zone => (
                    <div key={zone.id} className="group bg-background-secondary border border-border-primary rounded-2xl overflow-hidden hover:border-accent-primary/50 transition-colors">
                      <div className="relative h-32 w-full">
                        <Image src={zone.image} alt={zone.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-1">{zone.name}</h3>
                        <p className="text-text-secondary text-sm mb-4">{zone.computersCount} ta kompyuter</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-accent-primary">{zone.price}/soat</span>
                          <button onClick={() => { setIsModalOpen(true); setSelectedZone(zone.id); }} className="text-sm font-semibold text-text-primary hover:text-accent-primary transition-colors flex items-center gap-1">
                            Band qilish <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews Section */}
              <section className="animate-in fade-in slide-in-from-bottom-8">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-accent-primary" />
                  Mijozlar sharhlari ({club.reviewsCount})
                </h2>
                
                <div className="space-y-4 mb-8">
                  {club.reviews.map(review => (
                    <div key={review.id} className="bg-background-secondary border border-border-primary rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-background-tertiary rounded-full flex items-center justify-center font-bold text-accent-primary">
                          {review.author[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.author}</p>
                          <div className="flex text-accent-primary mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-border-primary'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>

                {/* Leave a review */}
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Sharh qoldirish</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star className={`h-8 w-8 ${star <= rating ? 'fill-accent-primary text-accent-primary' : 'text-border-primary'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Klub haqida fikringizni yozing..."
                      className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all resize-none mb-4"
                      rows={4}
                    />
                    
                    {/* Mock logic: checking if user is logged in via localStorage could be done, but we'll show submit for simplicity or mock login button */}
                    {typeof window !== 'undefined' && !localStorage.getItem("gameclub_user") ? (
                      <Button asChild className="w-full h-12 bg-background-tertiary text-text-primary hover:bg-background-secondary">
                        <Link href="/login">Sharh qoldirish uchun kiring</Link>
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full h-12 bg-accent-primary hover:bg-accent-glow transition-all">
                        Sharhni yuborish
                      </Button>
                    )}
                  </form>
                </div>
              </section>

            </div>

            {/* Right Column - Bar Menu & Location */}
            <div className="space-y-6">
              
              <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent-primary" />
                  Manzil
                </h3>
                <p className="text-text-secondary text-sm mb-2">{club.viloyat}, {club.tuman}</p>
                <p className="font-medium mb-4">{club.address}</p>
                <div className="w-full h-40 bg-background-tertiary rounded-xl flex items-center justify-center border border-border-primary text-text-secondary text-sm">
                  Karta bu yerda bo'ladi
                </div>
              </div>

              {club.barMenu && club.barMenu.length > 0 && (
                <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-8">
                  <h3 className="font-bold text-lg mb-4">Bar menyusi</h3>
                  <div className="space-y-3">
                    {club.barMenu.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b border-border-primary/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-text-secondary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background-secondary border border-border-primary rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-background-tertiary h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <h3 className="font-heading text-2xl font-bold mb-6">Joy band qilish</h3>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Zonani tanlang</label>
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary appearance-none"
                >
                  <option value="">Tanlang...</option>
                  {club.zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} - {z.price}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Sana</label>
                  <input 
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Vaqt</label>
                  <input 
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 bg-accent-primary hover:bg-accent-glow text-white font-bold text-lg rounded-xl transition-all shadow-accent-glow-sm">
                  Yuborish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
