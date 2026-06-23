"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Upload, Loader2, Info } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClubOwnerRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic lists states
  const [rooms, setRooms] = useState([{ id: Date.now(), name: "", type: "pc", capacity: "" }]);
  const [menuItems, setMenuItems] = useState([{ id: Date.now(), name: "", price: "", category: "drink" }]);
  const [skipMenu, setSkipMenu] = useState(false);

  const addRoom = () => setRooms([...rooms, { id: Date.now(), name: "", type: "pc", capacity: "" }]);
  const removeRoom = (id: number) => setRooms(rooms.filter(r => r.id !== id));

  const addMenuItem = () => setMenuItems([...menuItems, { id: Date.now(), name: "", price: "", category: "drink" }]);
  const removeMenuItem = (id: number) => setMenuItems(menuItems.filter(m => m.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // alert("Arizangiz muvaffaqiyatli yuborildi!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col relative pb-20">
      <header className="p-6 flex items-center justify-between border-b border-border-primary bg-background-primary/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <Logo />
        <Link 
          href="/royxatdan-otish" 
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Orqaga qaytish</span>
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center pt-8 px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-3xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-3">Hamkorlik arizasi</h1>
          <p className="text-text-secondary">
            Klubingizni CClub platformasiga qo'shish uchun quyidagi ma'lumotlarni to'ldiring. Arizangiz 24 soat ichida ko'rib chiqiladi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {/* SECTION 1: Personal Info */}
          <section className="bg-background-secondary border border-border-primary rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border-primary pb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-secondary/10 text-accent-secondary font-bold font-mono text-sm">1</div>
              <h2 className="font-heading text-xl font-bold text-text-primary">Akkaunt ma'lumotlari</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Ism <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Familiya <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Telefon <span className="text-status-occupied">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">+998</span>
                  <input required type="tel" className="w-full bg-background-tertiary border border-border-primary rounded-xl pl-14 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Email <span className="text-status-occupied">*</span></label>
                <input required type="email" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Parol <span className="text-status-occupied">*</span></label>
                <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Parolni tasdiqlash <span className="text-status-occupied">*</span></label>
                <input required type="password" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" />
              </div>
            </div>
          </section>

          {/* SECTION 2: Club Info */}
          <section className="bg-background-secondary border border-border-primary rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border-primary pb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-secondary/10 text-accent-secondary font-bold font-mono text-sm">2</div>
              <h2 className="font-heading text-xl font-bold text-text-primary">Klub ma'lumotlari</h2>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Klub nomi (Brand) <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" placeholder="Masalan: Nexus Gaming" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">To'liq manzil <span className="text-status-occupied">*</span></label>
                <input required type="text" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all" placeholder="Shahar, tuman, ko'cha, uy raqami" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary">Ish vaqti</label>
                  <div className="flex items-center gap-4 h-10">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                      <input type="checkbox" className="rounded border-border-primary bg-background-tertiary text-accent-secondary focus:ring-accent-secondary" />
                      24/7 ishlaydi
                    </label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-primary text-transparent select-none hidden sm:block">_</label>
                  <div className="flex items-center gap-2">
                    <input type="time" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" />
                    <span className="text-text-secondary">-</span>
                    <input type="time" className="w-full bg-background-tertiary border border-border-primary rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Qisqa tavsif</label>
                <textarea rows={3} className="w-full bg-background-tertiary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary focus:ring-1 focus:ring-accent-secondary transition-all resize-none" placeholder="Mijozlar uchun klubingiz qulayliklari haqida..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Klub rasmi yoki banneri <span className="text-status-occupied">*</span></label>
                <div className="border-2 border-dashed border-border-primary rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-background-tertiary/50 transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-background-tertiary flex items-center justify-center mb-3 group-hover:bg-accent-secondary/10 group-hover:text-accent-secondary transition-colors">
                    <Upload className="h-5 w-5 text-text-secondary group-hover:text-accent-secondary" />
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-1">Rasm yuklash uchun bosing</p>
                  <p className="text-xs text-text-secondary">PNG, JPG (max 5MB)</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 & 4: Rooms and PCs */}
          <section className="bg-background-secondary border border-border-primary rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-secondary/10 text-accent-secondary font-bold font-mono text-sm">3</div>
                <h2 className="font-heading text-xl font-bold text-text-primary">Zonalar va jihozlar</h2>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addRoom} className="border-border-primary text-xs h-8">
                <Plus className="h-3.5 w-3.5 mr-1" /> Zona qo'shish
              </Button>
            </div>
            
            <div className="space-y-6">
              {rooms.map((room, index) => (
                <div key={room.id} className="p-5 rounded-xl border border-border-primary bg-background-tertiary relative group animate-in fade-in zoom-in-95 duration-200">
                  {rooms.length > 1 && (
                    <button type="button" onClick={() => removeRoom(room.id)} className="absolute top-4 right-4 text-text-secondary hover:text-status-occupied transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  <h3 className="font-semibold text-text-primary mb-4 pr-8">Zona #{index + 1}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 border-b border-border-primary/50 pb-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Zona nomi</label>
                      <input required type="text" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="VIP Zal" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Turi</label>
                      <select className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-secondary appearance-none">
                        <option value="pc">PC (Kompyuter)</option>
                        <option value="ps5">PlayStation 5</option>
                        <option value="vr">VR</option>
                        <option value="other">Boshqa</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Qurilmalar soni</label>
                      <input required type="number" min="1" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="10" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Kompyuter / Qurilma xususiyatlari</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <input type="text" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="GPU (Masalan: RTX 4070)" />
                      <input type="text" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="CPU (Masalan: i5-13400)" />
                      <input type="text" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="Monitor (Masalan: 240Hz)" />
                      <input type="text" className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="Narxi (soatiga)" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: Menu */}
          <section className="bg-background-secondary border border-border-primary rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-secondary/10 text-accent-secondary font-bold font-mono text-sm">4</div>
                <h2 className="font-heading text-xl font-bold text-text-primary">Bar / Menyu (ixtiyoriy)</h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary bg-background-tertiary px-3 py-1.5 rounded-lg border border-border-primary">
                <input 
                  type="checkbox" 
                  checked={skipMenu} 
                  onChange={(e) => setSkipMenu(e.target.checked)}
                  className="rounded border-border-primary bg-background-primary text-accent-secondary focus:ring-accent-secondary" 
                />
                Hozircha o'tkazib yuborish
              </label>
            </div>
            
            {!skipMenu ? (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-in fade-in zoom-in-95 duration-200">
                    <input type="text" className="w-full sm:flex-1 bg-background-tertiary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="Mahsulot nomi (Masalan: Red Bull)" />
                    <input type="text" className="w-full sm:w-32 bg-background-tertiary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary" placeholder="Narxi" />
                    <select className="w-full sm:w-40 bg-background-tertiary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-secondary appearance-none">
                      <option value="drink">Ichimlik</option>
                      <option value="snack">Snack</option>
                      <option value="food">Ovqat</option>
                    </select>
                    {menuItems.length > 1 && (
                      <button type="button" onClick={() => removeMenuItem(item.id)} className="p-2.5 text-text-secondary hover:text-status-occupied hover:bg-status-occupied/10 rounded-lg transition-colors border border-transparent self-end sm:self-auto">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addMenuItem} className="border-border-primary border-dashed text-text-secondary hover:text-text-primary mt-2">
                  <Plus className="h-4 w-4 mr-1" /> Mahsulot qo'shish
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center text-text-secondary border-2 border-dashed border-border-primary rounded-xl bg-background-tertiary/50">
                Siz bar menyusini to'ldirishni o'tkazib yubordingiz. Uni keyinroq admin paneldan qo'shishingiz mumkin.
              </div>
            )}
          </section>

          {/* SECTION 6: Submit */}
          <section className="bg-background-tertiary border border-border-primary rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-accent-secondary/20 text-accent-secondary shrink-0">
                <Info className="h-3.5 w-3.5" />
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">E'tibor bering:</strong> Arizangizni yuborganingizdan so'ng, CClub ma'muriyati siz ko'rsatgan raqam orqali aloqaga chiqadi va klubni tizimga ulanish jarayonini yakunlashda yordam beradi.
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <div className="flex items-center h-5 mt-0.5">
                <input required id="terms-club" type="checkbox" className="h-4 w-4 rounded border-border-primary bg-background-primary text-accent-secondary focus:ring-accent-secondary focus:ring-offset-background-tertiary cursor-pointer" />
              </div>
              <label htmlFor="terms-club" className="text-sm text-text-secondary leading-tight cursor-pointer">
                Men CClub tizimining <Link href="#" className="text-accent-secondary hover:underline">Hamkorlik shartnomasi</Link> va maxfiylik siyosati bilan to'liq tanishdim va rozi bo'laman. O'z klubim haqidagi kiritilgan ma'lumotlar to'g'riligini tasdiqlayman.
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-accent-secondary text-background-primary hover:bg-[#1bc1d9] text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Yuborilmoqda...</>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Arizani yuborish
                </>
              )}
            </Button>
          </section>

        </form>
      </main>
    </div>
  );
}
