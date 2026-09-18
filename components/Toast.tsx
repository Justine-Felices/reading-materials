"use client";

import { useEffect } from "react";
import { CheckCircle2, Info } from "lucide-react";

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

export default function Toast({ message, open, onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[80] w-[min(92vw,24rem)] -translate-x-1/2 animate-fade-up"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-dark">
          {message.toLowerCase().includes("coming soon") ? (
            <Info className="h-4 w-4" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <p className="pt-1 text-sm font-semibold text-foreground">{message}</p>
      </div>
    </div>
  );
}
