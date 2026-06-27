"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Star, Monitor, Gamepad2, Clock, Wallet, ChevronRight, CheckCircle2, ShoppingCart, Plus, Minus, X, Info, Coffee } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { MOCK_CLUBS, Computer, Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, fadeIn, scaleIn, staggerContainer, viewportOnce } from "@/lib/animations";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function ClubProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const { shouldAnimate, isDesktop } = useDesktopAnimation();
  
  const MotionDiv = shouldAnimate ? motion.div : "div";
  const MotionSection = shouldAnimate ? motion.section : "section";
  
  const initialClub = MOCK_CLUBS.find(c => c.id === id);
  const [club, setClub] = useState(initialClub);
  
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("cclub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleBookingClick = (zoneId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
      setStep(1);
      setSelectedZone(zoneId);
    }
  };

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState(initialClub?.zones[0]?.id || "");
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [duration, setDuration] = useState<number | "">("");
  const [userName, setUserName] = useState("");

  // Bar Menu State
  const [category, setCategory] = useState<"all" | "snack" | "drink" | "fastfood">("all");
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barComputerNumber, setBarComputerNumber] = useState("");
  
  // Review State
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  if (!club) {
    return (
      <div className="min-h-screen text-text-primary flex flex-col relative md:bg-stripe-gradient bg-background-primary md:bg-transparent">
        {isDesktop && (
          <Suspense fallback={null}>
            <SceneWrapper variant="light" />
          </Suspense>
        )}
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

  const totalComputers = club.computers?.length || 0;
  const freeCount = club.computers?.filter(c => c.status === "free").length || club.freeCount;
  const occupiedCount = totalComputers - freeCount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComputer || !duration) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    
    // Update local state to show as occupied
    const updatedComputers = club.computers?.map(c => 
      c.id === selectedComputer.id ? { ...c, status: "occupied" as const, endsIn: Number(duration) * 60 } : c
    );
    setClub({ ...club, computers: updatedComputers, freeCount: club.freeCount - 1, occupiedCount: club.occupiedCount + 1 });

    setIsModalOpen(false);
    setStep(1);
    setSelectedComputer(null);
    setDuration("");
    setUserName("");

    const totalPrice = (selectedComputer.hourlyRate * Number(duration)).toLocaleString();
    
    toast.success(`✅ ${selectedComputer.number}-kompyuter ${duration} soatga band qilindi! Jami: ${totalPrice} so'm`);
  };

  const handleBarOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barComputerNumber) {
      toast.error("Kompyuter raqamini kiriting");
      return;
    }

    setIsBarModalOpen(false);
    setCart([]);
    setBarComputerNumber("");
    toast.success("Buyurtmangiz qabul qilindi! Tez orada yetkaziladi 🎮");
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = category === "all" ? club.products : club.products?.filter(p => p.category === category);

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
    <div className="min-h-screen bg-background-primary md:bg-transparent text-text-primary flex flex-col relative md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="light" />
        </Suspense>
      )}
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <Link href="/clublar" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Klublarga qaytish</span>
          </Link>

          {/* Hero Section */}
          <MotionDiv 
            {...(shouldAnimate ? { variants: fadeIn, initial: "hidden", animate: "visible" } : {})}
            className={cn("relative h-64 sm:h-80 md:h-[400px] w-full rounded-50px overflow-hidden mb-8", !shouldAnimate && "animate-in fade-in slide-in-from-bottom-4")}
          >
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
                  <div className="section-badge">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-status-online"></span>
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-wider">
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
                  <span className="gradient-text">{club.name}</span>
                </h1>
                
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-4.5 w-4.5 text-accent-primary shrink-0" />
                  <span>{club.viloyat}, {club.tuman}</span>
                </div>
              </div>
              
              <Button onClick={() => handleBookingClick(club.zones[0]?.id || "")} className="h-14 px-8 rounded-50px bg-accent-primary hover:bg-accent-glow text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all shrink-0">
                Joy band qilish
              </Button>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Info & Zones */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Real-time Status Panel */}
              <MotionSection
                {...(shouldAnimate ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                className={cn("glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4", !shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
              >
                <div>
                  <h3 className="text-lg font-bold mb-1">Kompyuterlar Holati</h3>
                  <p className="text-sm text-text-secondary">Real-time ma'lumot</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-2 bg-[#34D399]/10 text-[#34D399] px-4 py-2 rounded-full border border-[#34D399]/20">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#34D399] animate-pulse"></div>
                    {freeCount} ta bo'sh
                  </div>
                  <div className="flex items-center gap-2 bg-[#ef4444]/10 text-[#ef4444] px-4 py-2 rounded-full border border-[#ef4444]/20">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]"></div>
                    {occupiedCount} ta band
                  </div>
                  <div className="px-4 py-2 bg-background-tertiary rounded-full border border-border-primary text-text-primary">
                    Jami: {totalComputers} ta
                  </div>
                </div>
              </MotionSection>

              {/* Info Grid */}
              <MotionSection
                {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4", !shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
              >
                <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                  <Monitor className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Kompyuterlar</span>
                  <span className="font-bold text-lg">{totalComputers} ta</span>
                </MotionDiv>
                <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                  <Gamepad2 className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Zonalar</span>
                  <span className="font-bold text-lg">{club.zones.length} ta</span>
                </MotionDiv>
                <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Ish vaqti</span>
                  <span className="font-bold text-lg">{club.workingHours}</span>
                </MotionDiv>
                <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-6 w-6 text-accent-primary mb-2" />
                  <span className="text-sm text-text-secondary mb-1">Boshlang'ich narx</span>
                  <span className="font-bold text-lg">{club.price.split('/')[0]}</span>
                </MotionDiv>
              </MotionSection>

              {/* Zones Section */}
              <MotionSection
                {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                className={cn(!shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
              >
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-accent-primary" />
                  Mavjud zonalar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {club.zones.map(zone => (
                    <MotionDiv
                      key={zone.id}
                      {...(shouldAnimate ? { variants: fadeUp, whileHover: { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } } } : {})}
                      className="group glass-card overflow-hidden hover:border-accent-primary/50 transition-colors"
                    >
                      <div className="relative h-32 w-full">
                        <Image src={zone.image} alt={zone.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-1">{zone.name}</h3>
                        <p className="text-text-secondary text-sm mb-4">{zone.computersCount} ta kompyuter</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-accent-primary">{zone.price}/soat</span>
                          <button onClick={() => handleBookingClick(zone.id)} className="text-sm font-semibold text-text-primary hover:text-accent-primary transition-colors flex items-center gap-1">
                            Band qilish <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </MotionSection>

              {/* Bar Menu Section */}
              {club.products && club.products.length > 0 && (
                <MotionSection
                  {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                  className={cn(!shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                      <Coffee className="h-6 w-6 text-accent-primary" />
                      Bar Menyu
                    </h2>
                  </div>

                  {/* Category Filters */}
                  <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                    {["all", "snack", "drink", "fastfood"].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-colors",
                          category === cat 
                            ? "bg-accent-primary text-white" 
                            : "bg-background-tertiary text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {cat === "all" ? "Hammasi" : cat === "snack" ? "Snack" : cat === "drink" ? "Ichimlik" : "Fastfood"}
                      </button>
                    ))}
                  </MotionDiv>

                  {/* Products Grid */}
                  <MotionDiv 
                    {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                  >
                    {filteredProducts?.map(product => (
                      <MotionDiv 
                        key={product.id} 
                        {...(shouldAnimate ? { variants: fadeUp } : {})}
                        className="glass-card overflow-hidden flex flex-col"
                      >
                        <div className="relative h-32 w-full bg-background-tertiary">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h4 className="font-bold text-sm mb-1">{product.name}</h4>
                          <p className="text-accent-primary font-semibold text-sm mb-3 mt-auto">{product.price.toLocaleString()} so'm</p>
                          <Button onClick={() => addToCart(product)} variant="outline" size="sm" className="w-full h-8 text-xs border-border-primary hover:bg-accent-primary hover:text-white hover:border-accent-primary">
                            <Plus className="h-3 w-3 mr-1" /> Qo'shish
                          </Button>
                        </div>
                      </MotionDiv>
                    ))}
                  </MotionDiv>
                </MotionSection>
              )}

              {/* Reviews Section */}
              <MotionSection
                {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                className={cn(!shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
              >
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-accent-primary" />
                  Mijozlar sharhlari ({club.reviewsCount})
                </h2>
                
                <div className="space-y-4 mb-8">
                  {club.reviews.map(review => (
                    <MotionDiv 
                      key={review.id} 
                      {...(shouldAnimate ? { variants: fadeUp } : {})}
                      className="glass-card p-5"
                    >
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
                    </MotionDiv>
                  ))}
                </div>

                {/* Leave a review */}
                <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})} className="glass-card p-6">
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
                      className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all resize-none mb-4"
                      rows={4}
                    />
                    <Button type="submit" className="w-full h-12 bg-accent-primary hover:bg-accent-glow transition-all">
                      Sharhni yuborish
                    </Button>
                  </form>
                </MotionDiv>
              </MotionSection>

            </div>

            {/* Right Column - Location */}
            <div className="space-y-6">
              <MotionDiv
                {...(shouldAnimate ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
                className={cn("glass-card p-6", !shouldAnimate && "animate-in fade-in slide-in-from-bottom-8")}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent-primary" />
                  Manzil
                </h3>
                <p className="text-text-secondary text-sm mb-2">{club.viloyat}, {club.tuman}</p>
                <p className="font-medium mb-4">{club.address}</p>
                <div className="w-full h-40 bg-background-tertiary rounded-50px flex items-center justify-center border border-border-primary text-text-secondary text-sm">
                  Karta bu yerda bo'ladi
                </div>
              </MotionDiv>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Cart Widget */}
      {cartItemsCount > 0 && !isBarModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in w-[90%] max-w-sm">
          <div className="bg-background-secondary border border-border-primary shadow-2xl rounded-3xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-accent-primary/20 text-accent-primary rounded-full flex items-center justify-center relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Jami summa:</p>
                <p className="text-sm font-bold">{cartTotal.toLocaleString()} so'm</p>
              </div>
            </div>
            <Button onClick={() => setIsBarModalOpen(true)} className="bg-accent-primary hover:bg-accent-glow h-10 px-4 rounded-xl shadow-accent-glow-sm">
              Buyurtma berish
            </Button>
          </div>
        </div>
      )}

      {/* Bar Order Modal */}
      <AnimatePresence>
        {isBarModalOpen && (
          <MotionDiv 
            {...(shouldAnimate ? {
              variants: fadeIn,
              initial: "hidden",
              animate: "visible",
              exit: "hidden"
            } : {})}
            className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", !shouldAnimate && "animate-in fade-in")}
          >
            <MotionDiv
              {...(shouldAnimate ? {
                variants: scaleIn,
                initial: "hidden",
                animate: "visible",
                exit: "hidden"
              } : {})}
              className="glass-card  p-6 md:p-8 w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsBarModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-background-tertiary h-8 w-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-accent-primary" />
                Savat
              </h3>
              
              <div className="overflow-y-auto pr-2 flex-grow mb-6 space-y-4 hide-scrollbar">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center bg-background-tertiary p-3 rounded-2xl border border-border-primary">
                    <div>
                      <h4 className="font-bold text-sm">{item.product.name}</h4>
                      <p className="text-xs text-text-secondary">{item.product.price.toLocaleString()} so'm x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="h-7 w-7 bg-background-secondary border border-border-primary rounded-full flex items-center justify-center hover:text-accent-primary transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="h-7 w-7 bg-background-secondary border border-border-primary rounded-full flex items-center justify-center hover:text-accent-primary transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleBarOrderSubmit} className="space-y-4 pt-4 border-t border-border-primary">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-text-secondary">Umumiy summa:</span>
                  <span className="text-xl font-bold">{cartTotal.toLocaleString()} so'm</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Kompyuter raqami (Majburiy)</label>
                  <input 
                    type="text"
                    required
                    placeholder="Masalan: 12"
                    value={barComputerNumber}
                    onChange={(e) => setBarComputerNumber(e.target.value)}
                    className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-accent-primary hover:bg-accent-glow text-white font-bold  transition-all shadow-accent-glow-sm">
                  Buyurtmani yuborish
                </Button>
              </form>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Booking Modal (3 Steps) */}
      <AnimatePresence>
        {isModalOpen && (
          <MotionDiv
            {...(shouldAnimate ? {
              variants: fadeIn,
              initial: "hidden",
              animate: "visible",
              exit: "hidden"
            } : {})}
            className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", !shouldAnimate && "animate-in fade-in")}
          >
            <MotionDiv
              {...(shouldAnimate ? {
                variants: scaleIn,
                initial: "hidden",
                animate: "visible",
                exit: "hidden"
              } : {})}
              className="glass-card  p-6 md:p-8 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-background-tertiary h-8 w-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold mb-2">Joy band qilish</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={cn("font-medium transition-colors", step >= 1 ? "text-accent-primary" : "text-text-secondary")}>1. Kompyuter</span>
                  <ChevronRight className="h-4 w-4 text-text-secondary" />
                  <span className={cn("font-medium transition-colors", step >= 2 ? "text-accent-primary" : "text-text-secondary")}>2. Vaqt</span>
                  <ChevronRight className="h-4 w-4 text-text-secondary" />
                  <span className={cn("font-medium transition-colors", step >= 3 ? "text-accent-primary" : "text-text-secondary")}>3. Tasdiqlash</span>
                </div>
              </div>
              
              <div className="overflow-y-auto pr-2 flex-grow hide-scrollbar">
                {step === 1 && (
                  <MotionDiv
                    {...(shouldAnimate ? {
                      initial: { opacity: 0, x: 20 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: -20 },
                      transition: { duration: 0.2 }
                    } : {})}
                    className={cn("space-y-6", !shouldAnimate && "animate-in slide-in-from-right-4")}
                  >
                    {/* Zone Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-border-primary">
                      {club.zones.map(z => (
                        <button 
                          key={z.id}
                          onClick={() => { setSelectedZone(z.id); setSelectedComputer(null); }}
                          className={cn(
                            "px-4 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
                            selectedZone === z.id 
                              ? "border-accent-primary text-accent-primary bg-accent-primary/5" 
                              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-background-tertiary"
                          )}
                        >
                          {z.name} <span className="opacity-70 text-xs font-normal ml-1">({z.price})</span>
                        </button>
                      ))}
                    </div>

                    {/* Computers Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {club.computers?.filter(c => c.zone === selectedZone).map(comp => (
                        <button
                          key={comp.id}
                          disabled={comp.status !== "free"}
                          onClick={() => setSelectedComputer(comp)}
                          className={cn(
                            "relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all",
                            comp.status === "free" 
                              ? selectedComputer?.id === comp.id 
                                ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                                : "border-[#34D399]/30 bg-[#34D399]/5 hover:border-[#34D399] hover:bg-[#34D399]/10"
                              : comp.status === "occupied"
                                ? "border-[#ef4444]/30 bg-[#ef4444]/5 opacity-60 cursor-not-allowed"
                                : "border-[#f59e0b]/40 bg-[#f59e0b]/10 cursor-not-allowed"
                          )}
                        >
                          <span className={cn("text-xl font-bold", 
                            comp.status === "free" ? "text-text-primary" : 
                            comp.status === "occupied" ? "text-[#ef4444]" : "text-[#f59e0b]"
                          )}>
                            {comp.number}
                          </span>
                          
                          {comp.status === "ending" && comp.endsIn && (
                            <div className="absolute -bottom-2 bg-background-secondary border border-border-primary rounded-full px-1.5 py-0.5 text-[10px] font-bold text-[#f59e0b] shadow-sm flex items-center gap-1 whitespace-nowrap z-10">
                              <Clock className="h-2.5 w-2.5" />
                              ~{comp.endsIn}m
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium bg-background-tertiary p-3 rounded-2xl border border-border-primary">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#34D399]"></div> Bo'sh</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> Band</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> Vaqti tugayapti</div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button 
                        onClick={() => setStep(2)} 
                        disabled={!selectedComputer}
                        className="h-12 px-8 bg-accent-primary hover:bg-accent-glow text-white"
                      >
                        Keyingi <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </MotionDiv>
                )}

                {step === 2 && selectedComputer && (
                  <MotionDiv
                    {...(shouldAnimate ? {
                      initial: { opacity: 0, x: 20 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: -20 },
                      transition: { duration: 0.2 }
                    } : {})}
                    className={cn("space-y-6", !shouldAnimate && "animate-in slide-in-from-right-4")}
                  >
                    <div className="bg-background-tertiary p-4 rounded-2xl border border-border-primary mb-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-text-secondary mb-1">Tanlangan kompyuter</p>
                        <p className="font-bold text-lg">{selectedComputer.number}-kompyuter ({club.zones.find(z=>z.id===selectedZone)?.name})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-secondary mb-1">Narxi (1 soat)</p>
                        <p className="font-bold text-lg text-accent-primary">{selectedComputer.hourlyRate.toLocaleString()} so'm</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Vaqtni tanlang</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setDuration(h)}
                            className={cn(
                              "h-12 rounded-2xl border font-semibold transition-all",
                              duration === h 
                                ? "border-accent-primary bg-accent-primary/10 text-accent-primary" 
                                : "border-border-primary bg-background-secondary text-text-primary hover:border-text-secondary"
                            )}
                          >
                            {h} soat
                          </button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">Yoki o'zingiz kiriting (soat)</label>
                        <input 
                          type="number" 
                          min="1" max="24"
                          placeholder="Masalan: 5"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
                          className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                    </div>

                    {duration && (
                      <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-2xl p-4 flex justify-between items-center">
                        <span className="font-medium text-text-primary">Jami summa:</span>
                        <span className="font-bold text-xl text-accent-primary">{(selectedComputer.hourlyRate * Number(duration)).toLocaleString()} so'm</span>
                      </div>
                    )}

                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 border-border-primary">
                        Orqaga
                      </Button>
                      <Button 
                        onClick={() => setStep(3)} 
                        disabled={!duration}
                        className="h-12 px-8 bg-accent-primary hover:bg-accent-glow text-white"
                      >
                        Keyingi <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </MotionDiv>
                )}

                {step === 3 && selectedComputer && duration && (
                  <form onSubmit={handleBookingSubmit}>
                    <MotionDiv
                      {...(shouldAnimate ? {
                        initial: { opacity: 0, x: 20 },
                        animate: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: -20 },
                        transition: { duration: 0.2 }
                      } : {})}
                      className={cn("space-y-6", !shouldAnimate && "animate-in slide-in-from-right-4")}
                    >
                      <div className="bg-background-tertiary p-5 rounded-2xl border border-border-primary space-y-4">
                        <h4 className="font-bold text-lg mb-2">Ma'lumotlarni tasdiqlang</h4>
                        
                        <div className="flex justify-between pb-3 border-b border-border-primary/50">
                          <span className="text-text-secondary">Zona:</span>
                          <span className="font-semibold">{club.zones.find(z=>z.id===selectedZone)?.name}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border-primary/50">
                          <span className="text-text-secondary">Kompyuter:</span>
                          <span className="font-semibold">№ {selectedComputer.number}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border-primary/50">
                          <span className="text-text-secondary">Vaqt:</span>
                          <span className="font-semibold">{duration} soat</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-text-secondary">To'lanadigan summa:</span>
                          <span className="font-bold text-xl text-accent-primary">{(selectedComputer.hourlyRate * Number(duration)).toLocaleString()} so'm</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Ismingiz (Ixtiyoriy)</label>
                        <input 
                          type="text"
                          placeholder="Masalan: Azamat"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-background-tertiary border border-border-primary rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                        />
                        <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" />
                          Ro'yxatdan o'tgan bo'lsangiz avtomatik aniqlanadi.
                        </p>
                      </div>

                      <div className="pt-4 flex justify-between gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(2)} className="h-14 px-6 border-border-primary flex-shrink-0">
                          Orqaga
                        </Button>
                        <Button type="submit" className="w-full h-14 bg-accent-primary hover:bg-accent-glow text-white font-bold text-lg  transition-all shadow-accent-glow-sm flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Tasdiqlash
                        </Button>
                      </div>
                    </MotionDiv>
                  </form>
                )}

              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Auth Warning Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <MotionDiv
            {...(shouldAnimate ? {
              variants: fadeIn,
              initial: "hidden",
              animate: "visible",
              exit: "hidden"
            } : {})}
            className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", !shouldAnimate && "animate-in fade-in")}
          >
            <MotionDiv
              {...(shouldAnimate ? {
                variants: scaleIn,
                initial: "hidden",
                animate: "visible",
                exit: "hidden"
              } : {})}
              className="glass-card  p-6 md:p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-background-tertiary h-8 w-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="h-16 w-16 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-primary mb-4">
                <Info className="h-8 w-8" />
              </div>
              
              <h3 className="font-heading text-xl font-bold mb-2">Tizimga kiring</h3>
              <p className="text-text-secondary text-sm mb-6">
                Joy band qilish uchun avval profilingizga kirishingiz lozim.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Button asChild className="w-full bg-accent-primary hover:bg-accent-glow text-white h-12 ">
                  <Link href={`/login?returnUrl=/clublar/${id}`}>
                    Kirish
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-border-primary text-text-primary h-12  hover:bg-background-tertiary">
                  <Link href="/royxatdan-otish/mijoz">
                    Ro&apos;yxatdan o&apos;tish
                  </Link>
                </Button>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
