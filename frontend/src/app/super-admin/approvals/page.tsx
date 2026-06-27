"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, MapPin, Monitor } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Mock data for pending applications
const initialPendingClubs = [
  {
    id: "c1",
    name: "Cyber Space",
    ownerName: "Axmadbek",
    phone: "+998 90 123 45 67",
    address: "Toshkent shahar, Yunusobod tumani",
    pcs: 40,
    vipPcs: 10,
    status: "PENDING",
    submittedAt: "2026-06-27T10:00:00Z"
  },
  {
    id: "c2",
    name: "GG Zone",
    ownerName: "Sherzod",
    phone: "+998 99 987 65 43",
    address: "Toshkent shahar, Chilonzor tumani",
    pcs: 20,
    vipPcs: 5,
    status: "PENDING",
    submittedAt: "2026-06-26T15:30:00Z"
  }
];

export default function ApprovalsPage() {
  const [clubs, setClubs] = useState(initialPendingClubs);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id: string) => {
    // Backend API ga so'rov yuborish kerak bo'ladi
    // TODO: fetch("/api/super-admin/clubs/approve", { method: "POST", body: { id } })
    
    setClubs(clubs.filter(c => c.id !== id));
    setSelectedClub(null);
    toast.success("Klub arizasi tasdiqlandi", {
      description: "Klub egasiga email orqali xabar yuborildi."
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Iltimos, rad etish sababini kiriting");
      return;
    }

    // Backend API ga so'rov yuborish kerak bo'ladi
    // TODO: fetch("/api/super-admin/clubs/reject", { method: "POST", body: { id: selectedClub.id, reason: rejectReason } })
    
    setClubs(clubs.filter(c => c.id !== selectedClub.id));
    setShowRejectModal(false);
    setSelectedClub(null);
    setRejectReason("");
    toast.error("Klub arizasi rad etildi", {
      description: "Klub egasiga sababi ko'rsatilgan email yuborildi."
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left List */}
      <div className="w-1/3 bg-background-secondary border border-border-primary rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border-primary bg-background-tertiary">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent-glow" />
            Kutayotgan Arizalar ({clubs.length})
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {clubs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-secondary text-sm">
              Yangi arizalar yo'q
            </div>
          ) : (
            clubs.map(club => (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className={`w-full text-left p-4 rounded-lg transition-colors border ${
                  selectedClub?.id === club.id 
                    ? "bg-accent-primary/10 border-accent-primary/50" 
                    : "bg-background-primary border-transparent hover:border-border-primary"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white">{club.name}</h3>
                  <span className="text-xs text-text-secondary">
                    {new Date(club.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">{club.address}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    {club.pcs + club.vipPcs} ta PC
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 bg-background-secondary border border-border-primary rounded-xl overflow-y-auto">
        {selectedClub ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold font-heading text-white mb-2">{selectedClub.name}</h2>
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <span className="px-2 py-1 bg-accent-glow/20 text-accent-glow rounded text-xs font-bold uppercase tracking-wider">
                    Yangi Ariza
                  </span>
                  <span>Yuborilgan vaqti: {new Date(selectedClub.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 border-b border-border-primary pb-2">Klub Egasi</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-text-secondary inline-block w-24">F.I.SH:</span> {selectedClub.ownerName}</p>
                    <p><span className="text-text-secondary inline-block w-24">Telefon:</span> {selectedClub.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-3 border-b border-border-primary pb-2">Klub Ma'lumotlari</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                      {selectedClub.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 border-b border-border-primary pb-2">Texnik Imkoniyatlar</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-text-secondary inline-block w-32">Standard zonalar:</span> {selectedClub.pcs} ta PC</p>
                    <p><span className="text-text-secondary inline-block w-32">VIP zonalar:</span> {selectedClub.vipPcs} ta PC</p>
                    <p className="font-bold text-accent-glow mt-2">Jami: {selectedClub.pcs + selectedClub.vipPcs} ta kompyuter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-border-primary pt-6">
              <Button 
                className="flex-1 bg-status-free hover:bg-status-free/80 text-black font-bold flex items-center justify-center gap-2"
                onClick={() => handleApprove(selectedClub.id)}
              >
                <CheckCircle className="h-5 w-5" />
                Arizani Tasdiqlash
              </Button>
              <Button 
                variant="outline"
                className="flex-1 text-status-occupied border-status-occupied hover:bg-status-occupied hover:text-white flex items-center justify-center gap-2 transition-colors"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle className="h-5 w-5" />
                Rad Etish
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary p-8 text-center">
            <CheckSquare className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-2">Arizani tanlang</p>
            <p className="max-w-sm">Ro'yxatdan biror arizani tanlab, uning to'liq ma'lumotlarini shu yerda ko'rishingiz mumkin.</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-background-secondary border border-border-primary rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Arizani rad etish</h3>
            <p className="text-sm text-text-secondary mb-4">
              Klub egasiga rad etish sababini aniq yozib yuboring. Bu matn ularga email/sms tarzida yetkaziladi.
            </p>
            
            <textarea
              className="w-full bg-background-primary border border-border-primary rounded-lg p-3 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary min-h-[100px] mb-4"
              placeholder="Masalan: Klub rasmlari talabga javob bermadi yoki manzil noaniq ko'rsatilgan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Bekor qilish
              </Button>
              <Button 
                className="bg-status-occupied hover:bg-status-occupied/80 text-white"
                onClick={handleReject}
              >
                Tasdiqlash va Yuborish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
