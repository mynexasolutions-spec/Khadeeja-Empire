"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: ReactNode;
  footer?: ReactNode;
  ariaLabel?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  ariaLabel,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    const focusable = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusable?.[0] as HTMLElement;
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-hidden={!open}
        aria-label={ariaLabel ?? title}
        className={cn(
          "fixed top-0 bottom-0 z-[61] w-full max-w-md bg-surface shadow-lg flex flex-col transition-transform duration-300 ease-out",
          side === "right" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full pointer-events-none"
              : "-translate-x-full pointer-events-none"
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-h3">{title}</h2>
            <IconButton onClick={onClose} ariaLabel="Close drawer">
              <X size={20} />
            </IconButton>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="absolute top-4 right-4 z-10 inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-ink hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="border-t border-border p-6 bg-surface">{footer}</div>
        )}
      </div>
    </>
  );
}