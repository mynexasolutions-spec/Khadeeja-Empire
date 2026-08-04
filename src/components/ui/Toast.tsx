"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastState {
  id: number;
  message: string;
  type?: "success" | "error";
}

let toastId = 0;
const listeners = new Set<(toast: ToastState) => void>();

export function showToast(message: string, type: "success" | "error" = "success") {
  const toast = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const listener = (toast: ToastState) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-[80] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-5 py-4 shadow-lg rounded-lg min-w-[280px] animate-slide-up",
            toast.type === "error" ? "bg-primary text-white" : "bg-ink text-white"
          )}
        >
          {toast.type !== "error" && <Check size={18} className="flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => remove(toast.id)}
            aria-label="Dismiss notification"
            className="ml-auto opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}