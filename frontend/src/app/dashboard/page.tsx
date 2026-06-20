"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { ActiveSession } from "@/components/dashboard/ActiveSession";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { UserCabinet } from "@/components/dashboard/UserCabinet";
import { MenuPreview } from "@/components/dashboard/MenuPreview";
import { OrderHistory, Order } from "@/components/dashboard/OrderHistory";

// Session qismiga date va time qo'shildi
interface Session {
  pc: string;
  zone: string;
  date: string; // Yangi qo'shildi
  time: string; // Yangi qo'shildi
  duration: string;
  startTime: number;
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  joinDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Date va Time ni tanlash uchun state'lar
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  useEffect(() => {
    // Load or initialize mock session data
    let localUser = localStorage.getItem("gameclub_user");
    if (!localUser) {
      // Auto-populate default user if none exists (for quick testing)
      const defaultUser = {
        name: "Temur",
        phone: "+998 90 123 45 67",
        email: "temur@gameclubhub.uz",
        joinDate: "19-iyun, 2026-yil",
      };
      localStorage.setItem("gameclub_user", JSON.stringify(defaultUser));
      localUser = JSON.stringify(defaultUser);
    }
    setUser(JSON.parse(localUser));

    // Load active session if any
    const localSession = localStorage.getItem("gameclub_session");
    if (localSession) {
      setSession(JSON.parse(localSession));
    }

    // Load orders
    const localOrders = localStorage.getItem("gameclub_orders");
    // Xato tuzatildi: JSON.JSON.parse -> JSON.parse
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    }

    setIsLoading(false);
  }, []);

  // HandleBook funksiyasi endi date, time va duration ni ham oladi
  const handleBook = (
    pc: string, 
    zone: string, 
    date: string, 
    time: string, 
    duration: string
  ) => {
    const newSession: Session = {
      pc,
      zone,
      date, // Yangi qo'shildi
      time, // Yangi qo'shildi
      duration,
      startTime: Date.now(),
    };
    localStorage.setItem("gameclub_session", JSON.stringify(newSession));
    setSession(newSession);
    setIsBookingOpen(false);
    // Booking tugagandan so'ng state'larni ham tozalash
    setBookingDate("");
    setBookingTime("");
  };

  const handleEndSession = () => {
    localStorage.removeItem("gameclub_session");
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-accent-glow" />
          <p className="text-sm font-semibold text-text-secondary">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background-primary pb-12">
      {user && <Header userName={user.name} />}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Active Session Notification */}
        {/* ActiveSession komponentiga yangi ma'lumotlarni uzatish kerak bo'lsa, u yerda ham o'zgartirish kiritish kerak */}
        <ActiveSession session={session} onEndSession={handleEndSession} />

        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left / Middle: Actions & Content previews */}
          <div className="lg:col-span-2 space-y-2">
            <QuickActions 
              onOpenBooking={() => setIsBookingOpen(true)} 
              hasActiveSession={!!session} 
            />
            <MenuPreview />
            <OrderHistory orders={orders} />
          </div>

          {/* Right Column: User Profile info */}
          <div className="space-y-6">
            {user && (
              <UserCabinet 
                name={user.name} 
                phone={user.phone} 
                joinDate={user.joinDate} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        // onBook prop'iga date va time state'larini ham uzatish
        onBook={handleBook} 
        // BookingModal'da date va time state'larini boshqarish uchun
        bookingDate={bookingDate} 
        setBookingDate={setBookingDate}
        bookingTime={bookingTime}
        setBookingTime={setBookingTime}
      />
    </main>
  );
}
