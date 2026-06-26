"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, Star, MapPin, Monitor, Clock, Calendar, 
  ShoppingCart, User as UserIcon, ArrowRight, ShieldCheck, 
  Gamepad2, ChevronRight, RefreshCw, Sparkles
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { 
  MOCK_CLUBS, mockUserBookings, mockUserOrders, 
  UserBooking, UserOrder, Club 
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

export default function DashboardPage() {
  const router = useRouter();
  const { shouldAnimate } = useDesktopAnimation();
  
  const MotionDiv = shouldAnimate ? motion.div : "div";
  const MotionSection = shouldAnimate ? motion.section : "section";
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);

  useEffect(() => {
    // Route protection: check cclub_user
    const localUser = localStorage.getItem("cclub_user");
    if (!localUser) {
      router.push("/login?returnUrl=/dashboard");
      return;
    }
    setUser(JSON.parse(localUser));

    // Load user bookings
    const localBookings = localStorage.getItem("cclub_bookings");
    if (localBookings) {
      setBookings(JSON.parse(localBookings));
    } else {
      localStorage.setItem("cclub_bookings", JSON.stringify(mockUserBookings));
      setBookings(mockUserBookings);
    }

    // Load user orders
    const localOrders = localStorage.getItem("cclub_orders");
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      localStorage.setItem("cclub_orders", JSON.stringify(mockUserOrders));
      setOrders(mockUserOrders);
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-accent-glow" />
          <p className="text-sm font-semibold text-text-secondary">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Calculate active bookings and pending orders
  const activeBookingsCount = bookings.filter(b => b.status === "active").length;
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

  // Get recommended clubs (3-4 clubs)
  const recommendedClubs = MOCK_CLUBS.slice(0, 3);

  return (
    <main className="min-h-screen bg-background-primary pb-20 relative">
      <Suspense fallback={null}>
        <SceneWrapper variant="minimal" />
      </Suspense>
      <Header userName={user.name} />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Salomlashish + Stats */}
        <MotionSection
          {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
          className={cn("mb-10", !shouldAnimate && "animate-in fade-in slide-in-from-bottom-4 duration-500")}
        >
          <MotionDiv 
            {...(shouldAnimate ? { variants: fadeUp } : {})}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-background-secondary via-background-secondary to-accent-primary/5 border border-border-primary/50 rounded-3xl p-6 md:p-8"
          >
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                Salom, {user.name}! 👋
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Platformaga xush kelibsiz. Bugun qaysi klubda o&apos;ynamoqchisiz?
              </p>
            </div>
            
            <div className="flex gap-4">
              {/* Active Bookings Stat */}
              <div className="bg-background-tertiary/60 border border-[#34D399]/20 rounded-2xl p-4 min-w-[140px] md:min-w-[160px] flex flex-col justify-between">
                <span className="text-xs text-text-secondary font-medium">Faol bronlar</span>
                <span className="text-2xl font-bold text-[#34D399] mt-1">{activeBookingsCount} ta faol</span>
              </div>
              
              {/* Pending Orders Stat */}
              <div className="bg-background-tertiary/60 border border-[#f59e0b]/20 rounded-2xl p-4 min-w-[140px] md:min-w-[160px] flex flex-col justify-between">
                <span className="text-xs text-text-secondary font-medium">Kutilayotgan buyurtmalar</span>
                <span className="text-2xl font-bold text-[#f59e0b] mt-1">{pendingOrdersCount} ta buyurtma</span>
              </div>
            </div>
          </MotionDiv>
        </MotionSection>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Bookings, Orders, Recommendations */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* BO'LIM 1 — Mening bronlarim */}
            <MotionSection
              {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
              className="bg-background-secondary border border-border-primary rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white">
                  <Gamepad2 className="h-5 w-5 text-accent-primary" />
                  Mening bronlarim
                </h2>
                {bookings.length > 0 && (
                  <Link href="/clublar" className="text-xs font-semibold text-accent-glow hover:underline flex items-center gap-1">
                    Yangi bron qilish <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border-primary rounded-2xl">
                  <p className="text-text-secondary text-sm mb-4">Hali hech qanday bron yo&apos;q</p>
                  <Button asChild className="bg-accent-primary hover:bg-accent-glow text-white rounded-xl px-5 h-10 text-xs">
                    <Link href="/clublar">Klub topish &rarr;</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <MotionDiv 
                      key={booking.id}
                      {...(shouldAnimate ? { variants: fadeUp } : {})}
                      className="bg-background-tertiary border border-border-primary/50 hover:border-accent-primary/30 transition-colors rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base">{booking.clubName}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Monitor className="h-3.5 w-3.5 text-accent-primary" /> {booking.zone} (№ {booking.computerNumber})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-accent-primary" /> {booking.startedAt} - {booking.endsAt.split(', ')[1] || booking.endsAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-primary/30">
                        <span className="font-mono text-sm font-bold text-accent-primary">
                          {booking.totalAmount.toLocaleString()} so&apos;m
                        </span>
                        
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          booking.status === "active" 
                            ? "bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20" 
                            : "bg-background-primary text-text-secondary border-border-primary"
                        )}>
                          {booking.status === "active" ? "Faol" : "Tugagan"}
                        </span>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              )}
            </MotionSection>

            {/* BO'LIM 2 — Mening buyurtmalarim (Bar) */}
            <MotionSection
              {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
              className="bg-background-secondary border border-border-primary rounded-3xl p-6 md:p-8"
            >
              <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white mb-6">
                <ShoppingCart className="h-5 w-5 text-accent-primary" />
                Mening buyurtmalarim (Bar)
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border-primary rounded-2xl">
                  <p className="text-text-secondary text-sm">Hali hech qanday buyurtma yo&apos;q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <MotionDiv 
                      key={order.id} 
                      {...(shouldAnimate ? { variants: fadeUp } : {})}
                      className="bg-background-tertiary border border-border-primary/50 rounded-2xl p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-primary/30">
                        <div>
                          <h4 className="font-bold text-white text-sm">{order.clubName}</h4>
                          <span className="text-[11px] text-text-secondary font-medium">{order.createdAt}</span>
                        </div>
                        <span className={cn(
                          "px-2.5 py-0.5 self-start sm:self-auto rounded-full text-[11px] font-bold border",
                          order.status === "pending" 
                            ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20" 
                            : order.status === "delivered" 
                              ? "bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20"
                              : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"
                        )}>
                          {order.status === "pending" ? "Kutilmoqda" : order.status === "delivered" ? "Yetkazildi" : "Bekor qilindi"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-text-secondary">{item.name} <span className="text-text-primary/70">x{item.qty}</span></span>
                            <span className="text-text-primary font-medium">{(item.price * item.qty).toLocaleString()} so&apos;m</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-border-primary/30">
                        <span className="text-xs text-text-secondary">Umumiy summa:</span>
                        <span className="font-bold text-sm text-accent-primary">{order.total.toLocaleString()} so&apos;m</span>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              )}
            </MotionSection>

            {/* BO'LIM 3 — Yaqin klublar (Tavsiya) */}
            <MotionSection
              {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
              className="bg-background-secondary border border-border-primary rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-accent-primary" />
                  Tavsiya etilgan klublar
                </h2>
                <Link href="/clublar" className="text-xs font-semibold text-accent-glow hover:underline flex items-center gap-1">
                  Barcha klublar <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {recommendedClubs.map(club => {
                  const total = club.computers?.length || 0;
                  const free = club.computers?.filter(c => c.status === "free").length || club.freeCount;
                  
                  return (
                    <MotionDiv 
                      key={club.id} 
                      {...(shouldAnimate ? { variants: fadeUp } : {})}
                      className="bg-background-tertiary border border-border-primary/50 hover:border-accent-primary/30 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group"
                    >
                      <div className="relative h-28 w-full">
                        <img src={club.image} alt={club.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-tertiary to-transparent" />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-bold text-white text-sm truncate mb-1">{club.name}</h4>
                        
                        <div className="flex items-center gap-1 mb-2 text-xs text-text-secondary">
                          <MapPin className="h-3 w-3 shrink-0 text-accent-primary" />
                          <span className="truncate">{club.tuman}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4 text-xs mt-auto">
                          <div className="flex items-center gap-1 bg-[#34D399]/10 text-[#34D399] px-2 py-0.5 rounded border border-[#34D399]/10">
                            {free} bo&apos;sh
                          </div>
                          <div className="flex items-center gap-0.5 text-[#f59e0b]">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="font-bold">{club.rating}</span>
                          </div>
                        </div>

                        <Button asChild className="w-full h-9 bg-accent-primary hover:bg-accent-glow text-white text-xs rounded-xl mt-auto">
                          <Link href={`/clublar/${club.id}`}>
                            Ko&apos;rish &rarr;
                          </Link>
                        </Button>
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>
            </MotionSection>

          </div>

          {/* Right Column: Profile details */}
          <div className="space-y-6">
            
            {/* BO'LIM 4 — Mening kabinetim */}
            <MotionSection
              {...(shouldAnimate ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce } : {})}
              className={cn("bg-background-secondary border border-border-primary rounded-3xl p-6 md:p-8", !shouldAnimate && "animate-in fade-in slide-in-from-right-4 duration-500")}
            >
              <h2 className="font-heading text-lg font-bold flex items-center gap-2 text-white mb-6">
                <UserIcon className="h-5 w-5 text-accent-primary" />
                Mening kabinetim
              </h2>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-accent-deep border border-accent-glow/50 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{user.name}</h3>
                    <span className="text-xs text-text-secondary">Mijoz hisobi</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-primary/50 text-sm">
                  <div>
                    <span className="block text-xs text-text-secondary mb-0.5">Telefon raqam:</span>
                    <span className="font-semibold text-text-primary">{user.phone}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary mb-0.5">Email manzili:</span>
                    <span className="font-semibold text-text-primary">{user.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary mb-0.5">A&apos;zo bo&apos;lgan sana:</span>
                    <span className="font-semibold text-text-primary">{user.joinDate}</span>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full h-11 border-border-primary hover:bg-background-tertiary text-text-primary rounded-xl mt-4 text-xs font-semibold">
                  <Link href="/profile">
                    Profilni ko&apos;rish &rarr;
                  </Link>
                </Button>
              </div>
            </MotionSection>

          </div>

        </div>

      </div>
    </main>
  );
}
