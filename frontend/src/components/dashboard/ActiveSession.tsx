"use client";

import { Clock, Monitor, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Session {
  pc: string;
  zone: string;
  duration: string;
  startTime: number;
}

interface ActiveSessionProps {
  session: Session | null;
  onEndSession: () => void;
}

export function ActiveSession({ session, onEndSession }: ActiveSessionProps) {
  if (!session) return null;

  return (
    <div className="rounded-2xl border border-status-ending bg-status-ending/10 p-4 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-ending/20 text-status-ending">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-text-primary sm:text-base">
              Faol o&apos;yin sessiyasi: {session.pc}-PC ({session.zone})
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
              <Clock className="h-3.5 w-3.5 text-status-ending" />
              <span>Tanlangan vaqt: {session.duration}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEndSession}
          className="border-status-ending text-status-ending hover:bg-status-ending hover:text-white"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Sessiyani tugatish
        </Button>
      </div>
    </div>
  );
}
