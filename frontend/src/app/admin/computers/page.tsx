"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Monitor, 
  Search, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Gamepad2, 
  Clock 
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_COMPUTERS, Computer } from "@/lib/admin-mock-data";
import ComputerCard from "@/components/admin/computers/ComputerCard";
import ComputerControlPanel from "@/components/admin/computers/ComputerControlPanel";
import ChangePcModal from "@/components/admin/computers/ChangePcModal";
import { cn } from "@/lib/utils";

type ZoneFilter = "Hammasi" | "Standard" | "VIP" | "PS5";

function ComputersAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const [computers, setComputers] = useState<Computer[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneFilter>("Hammasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPc, setSelectedPc] = useState<Computer | null>(null);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isChangePcOpen, setIsChangePcOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial State Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("cclub_admin_computers");
    if (saved) {
      try {
        const { computers: savedComputers, timestamp } = JSON.parse(saved);
        const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);

        const updatedComputers = savedComputers.map((pc: Computer) => {
          if (pc.status === "free") return pc;
          
          const remaining = Math.max(0, pc.remainingSeconds - elapsedSeconds);
          if (remaining === 0) {
            return { ...pc, status: "free", remainingSeconds: 0, customerName: undefined };
          }
          const status = remaining < 600 ? "ending_soon" : pc.status;
          return { ...pc, remainingSeconds: remaining, status };
        });

        setComputers(updatedComputers);
        localStorage.setItem(
          "cclub_admin_computers",
          JSON.stringify({ computers: updatedComputers, timestamp: Date.now() })
        );
      } catch (e) {
        setComputers(MOCK_COMPUTERS);
      }
    } else {
      setComputers(MOCK_COMPUTERS);
      localStorage.setItem(
        "cclub_admin_computers",
        JSON.stringify({ computers: MOCK_COMPUTERS, timestamp: Date.now() })
      );
    }
    setIsMounted(true);
  }, []);

  // 2. Active 1-Second Timer Count Down
  useEffect(() => {
    if (!isMounted || computers.length === 0) return;

    const timer = setInterval(() => {
      setComputers((prev) => {
        const updated: Computer[] = prev.map((pc) => {
          if (pc.status === "free") return pc;
          if (pc.remainingSeconds <= 1) {
            toast.info(`PC ${pc.number} seansi yakunlandi`);
            return { ...pc, status: "free" as const, remainingSeconds: 0, customerName: undefined };
          }
          const newSec = pc.remainingSeconds - 1;
          const newStatus = (newSec < 600 ? "ending_soon" : pc.status) as Computer["status"];
          return { ...pc, remainingSeconds: newSec, status: newStatus };
        });

        // Sync with LocalStorage
        localStorage.setItem(
          "cclub_admin_computers",
          JSON.stringify({ computers: updated, timestamp: Date.now() })
        );

        // Keep selected PC info updated in the control panel
        if (selectedPc) {
          const currentSelected = updated.find((pc) => pc.id === selectedPc.id);
          if (currentSelected) {
            setSelectedPc(currentSelected);
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMounted, computers.length, selectedPc]);

  // Helper to persist state instantly on action
  const saveState = (updatedList: Computer[]) => {
    setComputers(updatedList);
    localStorage.setItem(
      "cclub_admin_computers",
      JSON.stringify({ computers: updatedList, timestamp: Date.now() })
    );
  };

  const logActivity = (action: string, details: string, type: "pc" | "order" | "system" | "product") => {
    const saved = localStorage.getItem("cclub_admin_activity");
    let currentLogs = [];
    if (saved) {
      try {
        currentLogs = JSON.parse(saved);
      } catch (e) {}
    }
    const newLog = {
      id: `a_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    localStorage.setItem("cclub_admin_activity", JSON.stringify([newLog, ...currentLogs].slice(0, 100)));
    window.dispatchEvent(new Event("cclub_activity_updated"));
  };

  // Actions
  const handleStartSession = (pcId: string, customer: string, seconds: number) => {
    const updated: Computer[] = computers.map((pc) => {
      if (pc.id === pcId) {
        const status = (seconds < 600 ? "ending_soon" : "occupied") as Computer["status"];
        return {
          ...pc,
          status,
          remainingSeconds: seconds,
          customerName: customer || "Mijoz",
        };
      }
      return pc;
    });

    saveState(updated);

    const pc = computers.find((p) => p.id === pcId);
    toast.success(`${pc?.number}-PC ishga tushirildi`);
    logActivity(
      `PC ${pc?.number || ""} ishga tushirildi`,
      `Mijoz: ${customer || "Mijoz"}. Davomiyligi: ${Math.floor(seconds / 60)} daqiqa.`,
      "pc"
    );
    
    // Refresh control panel reference
    const current = updated.find((p) => p.id === pcId);
    if (current) setSelectedPc(current);
  };

  const handleStopSession = (pcId: string) => {
    const pc = computers.find((p) => p.id === pcId);
    if (!pc) return;

    const previousState = { ...pc };

    const updated: Computer[] = computers.map((item) => {
      if (item.id === pcId) {
        return { ...item, status: "free" as const, remainingSeconds: 0, customerName: undefined };
      }
      return item;
    });

    saveState(updated);

    toast.error(`PC ${pc.number} seansi to'xtatildi`, {
      duration: 5000,
      action: {
        label: "Bekor qilish",
        onClick: () => {
          setComputers((prev) => {
            const restored = prev.map((item) => {
              if (item.id === pcId) {
                return { ...previousState };
              }
              return item;
            });
            localStorage.setItem(
              "cclub_admin_computers",
              JSON.stringify({ computers: restored, timestamp: Date.now() })
            );
            return restored;
          });
          setSelectedPc(previousState);
          toast.success(`PC ${previousState.number} seansi tiklandi`);
          logActivity(
            `PC ${previousState.number} seansi tiklandi`,
            `To'xtatilgan seans bekor qilindi. Mijoz: ${previousState.customerName || "Mijoz"}.`,
            "pc"
          );
        },
      },
    });

    logActivity(
      `PC ${pc.number} seansi yakunlandi`,
      `Mijoz: ${pc.customerName || "Mijoz"}. Seans qo'lda to'xtatildi.`,
      "pc"
    );
    
    const current = updated.find((p) => p.id === pcId);
    if (current) setSelectedPc(current);
  };

  const handleAddTime = (pcId: string, additionalSeconds: number) => {
    const updated: Computer[] = computers.map((pc) => {
      if (pc.id === pcId) {
        const newSec = pc.remainingSeconds + additionalSeconds;
        const status = (newSec < 600 ? "ending_soon" : "occupied") as Computer["status"];
        return { ...pc, status, remainingSeconds: newSec };
      }
      return pc;
    });

    saveState(updated);

    const pc = computers.find((p) => p.id === pcId);
    const addedMinutes = Math.floor(additionalSeconds / 60);
    toast.success(`${pc?.number}-PC vaqti +${addedMinutes} daqiqaga uzaytirildi`);
    logActivity(
      `PC ${pc?.number || ""} seansi uzaytirildi`,
      `Qo'shimcha vaqt: +${addedMinutes} daqiqa.`,
      "pc"
    );

    // Refresh control panel reference
    const current = updated.find((p) => p.id === pcId);
    if (current) setSelectedPc(current);
  };

  const handleChangePc = (fromPcId: string, toPcId: string) => {
    const fromPc = computers.find((p) => p.id === fromPcId);
    const toPc = computers.find((p) => p.id === toPcId);
    if (!fromPc || !toPc) return;

    const updated: Computer[] = computers.map((pc) => {
      if (pc.id === fromPcId) {
        return { ...pc, status: "free" as const, remainingSeconds: 0, customerName: undefined };
      }
      if (pc.id === toPcId) {
        return {
          ...pc,
          status: fromPc.status,
          remainingSeconds: fromPc.remainingSeconds,
          customerName: fromPc.customerName,
        };
      }
      return pc;
    });

    saveState(updated);
    toast.success(`Seans PC ${fromPc.number} dan PC ${toPc.number} ga ko'chirildi`);
    logActivity(
      `PC almashtirildi`,
      `PC ${fromPc.number} dagi seans PC ${toPc.number} ga ko'chirildi. Mijoz: ${fromPc.customerName || "Mijoz"}.`,
      "pc"
    );

    // Shift Control Panel focus to the newly occupied PC
    const newActivePc = updated.find((p) => p.id === toPcId);
    if (newActivePc) {
      setSelectedPc(newActivePc);
    } else {
      setIsControlPanelOpen(false);
    }
  };

  // Filter & Search computation
  const filteredComputers = computers.filter((pc) => {
    const matchesZone = selectedZone === "Hammasi" || pc.zone === selectedZone;
    const matchesSearch =
      searchQuery === "" ||
      pc.number.toString().includes(searchQuery) ||
      (pc.customerName && pc.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusParam || pc.status === statusParam;
    return matchesZone && matchesSearch && matchesStatus;
  });

  // Zones for rendering when "Hammasi" is selected
  const renderedZones: { id: "Standard" | "VIP" | "PS5"; label: string; icon: any }[] = [
    { id: "Standard", label: "Standard Zona", icon: Cpu },
    { id: "VIP", label: "VIP Xonalar", icon: Layers },
    { id: "PS5", label: "PlayStation 5", icon: Gamepad2 },
  ];

  // Quick Stats
  const activePcsCount = computers.filter((c) => c.status !== "free").length;
  const freePcsCount = computers.filter((c) => c.status === "free").length;
  const endingSoonCount = computers.filter((c) => c.status === "ending_soon").length;

  if (!isMounted) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Yuklanmoqda...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Kompyuterlar xaritasi
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Kompyuterlar holatini monitoring qilish va seanslarni boshqarish
          </p>
        </div>

        {/* Stats Summary Widget */}
        <div className="flex flex-wrap gap-2 sm:gap-3 /40 /40  p-2 sm:p-3 glass-card">
          <div className="px-3 py-1 flex items-center gap-1.5 border-r border-border-glass/30">
            <span className="h-2 w-2 rounded-full bg-status-occupied" />
            <span className="text-xs text-text-secondary">
              Band: <strong className="text-text-primary font-bold">{activePcsCount}</strong>
            </span>
          </div>
          <div className="px-3 py-1 flex items-center gap-1.5 border-r border-border-glass/30">
            <span className="h-2 w-2 rounded-full bg-status-ending animate-pulse" />
            <span className="text-xs text-text-secondary">
              Tugash arafasida: <strong className="text-text-primary font-bold">{endingSoonCount}</strong>
            </span>
          </div>
          <div className="px-3 py-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-free" />
            <span className="text-xs text-text-secondary">
              Bo&apos;sh: <strong className="text-text-primary font-bold">{freePcsCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Control Bars: Filters and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Zone Filters Tab Buttons */}
        <div className="flex bg-background-secondary/50 border border-border-glass/50 p-1 rounded-3xl w-full md:w-auto shrink-0 select-none">
          {(["Hammasi", "Standard", "VIP", "PS5"] as ZoneFilter[]).map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all active:scale-95",
                selectedZone === zone
                  ? "bg-accent-primary text-white shadow-accent-glow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Raqam yoki mijoz bo'yicha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-secondary/30 border border-border-glass/65 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-all"
          />
        </div>
      </div>

      {statusParam && (
        <div className="flex items-center justify-between bg-status-ending/10 border border-status-ending/30 text-status-ending px-4 py-3 rounded-2xl text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Faqat tugash arafasidagi kompyuterlar ko&apos;rsatilmoqda (Status: {statusParam})</span>
          </div>
          <button 
            onClick={() => {
              router.push("/admin/computers");
            }}
            className="text-[10px] font-bold text-status-ending uppercase bg-status-ending/10 hover:bg-status-ending/20 px-2 py-1 rounded-full transition-all"
          >
            Filtrni tozalash
          </button>
        </div>
      )}

      {/* Grid Content */}
      <div className="space-y-6">
        {selectedZone === "Hammasi" ? (
          renderedZones.map((zone) => {
            // Filter computers for this zone & match search
            const zoneComputers = filteredComputers.filter((pc) => pc.zone === zone.id);
            if (zoneComputers.length === 0) return null;
            const ZoneIcon = zone.icon;

            return (
              <div
                key={zone.id}
                className="space-y-3 bg-background-secondary/10 border border-border-glass/25 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 border-b border-border-glass/20 pb-2">
                  <ZoneIcon className="h-4.5 w-4.5 text-accent-glow" />
                  <h3 className="font-heading text-sm font-bold text-text-primary tracking-wide">
                    {zone.label}
                  </h3>
                  <span className="text-[10px] bg-background-primary border border-border-glass/50 px-1.5 py-0.5 rounded-full text-text-secondary font-bold">
                    {zoneComputers.length} ta PC
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {zoneComputers.map((pc) => (
                    <ComputerCard
                      key={pc.id}
                      computer={pc}
                      onClick={() => {
                        setSelectedPc(pc);
                        setIsControlPanelOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          /* Single Zone Filter Grid */
          <div className="bg-background-secondary/10 border border-border-glass/25 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-glass/20 pb-2">
              <Monitor className="h-4.5 w-4.5 text-accent-glow" />
              <h3 className="font-heading text-sm font-bold text-text-primary tracking-wide">
                {selectedZone} Zona
              </h3>
              <span className="text-[10px] bg-background-primary border border-border-glass/50 px-1.5 py-0.5 rounded-full text-text-secondary font-bold">
                {filteredComputers.length} ta PC
              </span>
            </div>

            {filteredComputers.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-text-secondary">
                <AlertTriangle className="h-8 w-8 text-status-ending mb-2" />
                <p className="text-xs font-semibold">Mos keluvchi kompyuterlar topilmadi</p>
                <p className="text-[10px] opacity-75 mt-0.5">Filter yoki qidiruv so&apos;rovini tekshiring.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {filteredComputers.map((pc) => (
                  <ComputerCard
                    key={pc.id}
                    computer={pc}
                    onClick={() => {
                      setSelectedPc(pc);
                      setIsControlPanelOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Drawer Sheet */}
      <ComputerControlPanel
        isOpen={isControlPanelOpen}
        onClose={() => {
          setIsControlPanelOpen(false);
          setSelectedPc(null);
        }}
        computer={selectedPc}
        onStart={handleStartSession}
        onStop={handleStopSession}
        onAddTime={handleAddTime}
        onChangePcClick={() => setIsChangePcOpen(true)}
      />

      {/* Change PC Modal Dialog */}
      <ChangePcModal
        isOpen={isChangePcOpen}
        onClose={() => setIsChangePcOpen(false)}
        computers={computers}
        currentComputer={selectedPc}
        onChangePc={handleChangePc}
      />
    </main>
  );
}

export default function ComputersAdminPage() {
  return (
    <Suspense fallback={
      <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="h-8 w-8 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Yuklanmoqda...</span>
        </div>
      </main>
    }>
      <ComputersAdminContent />
    </Suspense>
  );
}
