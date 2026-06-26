"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Key, LogOut, Save, User, Smartphone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(
  () => import("@/components/three/SceneWrapper").then((mod) => ({ default: mod.SceneWrapper })),
  { ssr: false, loading: () => null }
);

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  joinDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { shouldAnimate, isDesktop } = useDesktopAnimation();
  const MotionDiv = shouldAnimate ? motion.div : "div";
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form Fields
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  
  // Settings Toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Password Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const localUser = localStorage.getItem("cclub_user");
    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setEditName(parsed.name || "");
      setEditPhone(parsed.phone || "");
      setEditEmail(parsed.email || "");
    } else {
      // Auto-populate default user if none exists (for quick testing in Phase 1)
      const defaultUser = {
        name: "Temur",
        phone: "+998 90 123 45 67",
        email: "temur@cclub.uz",
        joinDate: "19-iyun, 2026-yil",
      };
      localStorage.setItem("cclub_user", JSON.stringify(defaultUser));
      setUser(defaultUser);
      setEditName(defaultUser.name);
      setEditPhone(defaultUser.phone);
      setEditEmail(defaultUser.email);
    }
  }, [router]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!editName.trim()) {
      toast.error("Ism bo'sh bo'lmasligi kerak!");
      return;
    }

    const updatedUser = {
      ...user,
      name: editName,
      phone: editPhone,
      email: editEmail,
    };

    localStorage.setItem("cclub_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Profil ma'lumotlari saqlandi!");
    
    // Trigger custom event or reload header in parent if needed
    window.dispatchEvent(new Event("storage"));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Barcha parol maydonlarini to'ldiring!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parollar mos kelmadi!");
      return;
    }
    
    // Mock password save
    toast.success("Parol muvaffaqiyatli o'zgartirildi!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("cclub_user");
    localStorage.removeItem("cclub_session");
    localStorage.removeItem("cclub_orders");
    toast.success("Tizimdan chiqildi!");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary text-text-primary">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-glow/20 border-t-accent-glow" />
      </div>
    );
  }

  const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <main className="min-h-screen bg-background-primary md:bg-transparent pb-16 relative md:bg-stripe-gradient">
      {isDesktop && (
        <Suspense fallback={null}>
          <SceneWrapper variant="minimal" />
        </Suspense>
      )}
      {/* Header */}
      <header className="border-b border-border-glass bg-background-secondary/80 backdrop-blur-md py-4 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary px-3 h-10 border border-border-glass/40 hover:border-accent-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            Kabinetga
          </Button>

          <h1 className="font-heading text-sm font-bold text-text-primary sm:text-lg select-none">
            <span className="gradient-text">Mening Profilim</span>
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-glass text-text-secondary hover:text-status-occupied hover:border-status-occupied/50 transition-colors duration-200"
            title="Chiqish"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      <MotionDiv 
        {...(shouldAnimate ? { variants: staggerContainer, initial: "hidden", animate: "visible" } : {})}
        className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6"
      >
        {/* Avatar and Welcome Card */}
        <MotionDiv {...(shouldAnimate ? { variants: scaleIn } : {})}>
          <Card className="glass-card border-border-glass">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-deep border-2 border-accent-glow text-text-primary font-heading text-4xl font-bold shadow-accent-glow">
                {nameInitial}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-heading font-bold"><span className="gradient-text">{user.name}</span></h2>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-text-secondary">
                  <Calendar className="h-4 w-4 text-accent-glow" />
                  <span>A&apos;zo bo&apos;lingan sana: {user.joinDate}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Rasm yuklash funksiyasi Faza 2-da qo'shiladi.")}
                  className="mt-2 text-xs border-border-glass hover:border-accent-glow text-text-secondary hover:text-text-primary active:scale-95 transition-all"
                >
                  Avatar o&apos;zgartirish
                </Button>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Profile Info Card */}
        <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})}>
          <Card className="glass-card border-border-glass">
            <CardHeader className="pb-3 border-b border-border-glass/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-heading">
                  <User className="h-5 w-5 text-accent-glow" />
                  <span className="gradient-text">Profil ma&apos;lumotlari</span>
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs border-border-glass hover:border-accent-glow h-8"
                  >
                    Tahrirlash
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ismingiz</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon raqam</Label>
                    <Input
                      id="phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" size="sm" className="flex items-center gap-1.5 shadow-accent-glow active:scale-95 transition-transform duration-100">
                      <Save className="h-4 w-4" />
                      Saqlash
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(user.name);
                        setEditPhone(user.phone);
                        setEditEmail(user.email);
                      }}
                      className="active:scale-95 transition-transform duration-100"
                    >
                      Bekor qilish
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border-glass/20">
                    <span className="text-xs sm:text-sm text-text-secondary">Foydalanuvchi ismi:</span>
                    <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <User className="h-4 w-4 text-text-secondary" />
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-glass/20">
                    <span className="text-xs sm:text-sm text-text-secondary">Telefon raqam:</span>
                    <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-text-secondary" />
                      {user.phone || "Kiritilmagan"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-glass/20">
                    <span className="text-xs sm:text-sm text-text-secondary">Email manzil:</span>
                    <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Mail className="h-4 w-4 text-text-secondary" />
                      {user.email || "Kiritilmagan"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Settings Card */}
        <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})}>
          <Card className="glass-card border-border-glass">
            <CardHeader className="pb-3 border-b border-border-glass/40">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-heading">
                <Bell className="h-5 w-5 text-accent-glow" />
                <span className="gradient-text">Sozlamalar bo&apos;limi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-text-primary">Bildirishnomalar</p>
                <p className="text-xs text-text-secondary">Sessiya holati va buyurtmalar haqida bildirishnomalar olish</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? "bg-accent-primary" : "bg-accent-deep"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Change Password Card */}
        <MotionDiv {...(shouldAnimate ? { variants: fadeUp } : {})}>
          <Card className="glass-card border-border-glass">
            <CardHeader className="pb-3 border-b border-border-glass/40">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-heading">
                <Key className="h-5 w-5 text-accent-glow" />
                <span className="gradient-text">Hisobni boshqarish</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Parolni o&apos;zgartirish</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Joriy parol</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yangi parol</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yangi parolni tasdiqlash</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background-secondary border-border-glass focus:border-accent-glow text-text-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="w-full sm:w-auto shadow-accent-glow active:scale-95 transition-transform duration-100">
                  Parolni o&apos;zgartirish
                </Button>
              </form>
            </CardContent>
          </Card>
        </MotionDiv>
      </MotionDiv>
    </main>
  );
}
