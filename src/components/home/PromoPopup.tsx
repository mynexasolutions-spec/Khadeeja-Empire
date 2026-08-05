"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import type { PromoSettingsRecord } from "@/lib/admin/types";

export function PromoPopup({ promo }: { promo: PromoSettingsRecord | null }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    if (!promo) return;
    const storage = promo.frequency === "once" ? window.localStorage : window.sessionStorage;
    if (promo.frequency !== "always") storage.setItem(`ke-promo-dismissed-${promo.id}`, "1");
    setOpen(false);
  }, [promo]);

  useEffect(() => {
    if (!promo?.enabled) return;
    const dismissalKey = `ke-promo-dismissed-${promo.id}`;
    const viewKey = `ke-promo-views-${promo.id}`;
    const storage = promo.frequency === "once" ? window.localStorage : window.sessionStorage;
    const dismissed = promo.frequency !== "always" && storage.getItem(dismissalKey) === "1";
    const views = Number(window.localStorage.getItem(viewKey) ?? "0");
    if (dismissed || (promo.maxViews != null && views >= promo.maxViews)) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      window.localStorage.setItem(viewKey, String(views + 1));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [promo]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyboard);
      previousFocus?.focus();
    };
  }, [close, open]);

  if (!promo?.enabled || !open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative grid w-full max-w-2xl overflow-hidden border border-border bg-surface-elevated shadow-[0_24px_80px_rgba(24,20,18,0.28)] sm:grid-cols-[0.9fr_1.1fr]"
      >
        {promo.image ? (
          <div className="min-h-56 bg-cover bg-center sm:min-h-[420px]" style={{ backgroundImage: `url(${JSON.stringify(promo.image).slice(1, -1)})` }} role="img" aria-label="Promotional collection" />
        ) : (
          <div className="hidden bg-accent sm:block" aria-hidden="true" />
        )}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">A little something</p>
          <h2 id={titleId} className="text-h2 text-primary">{promo.title || "Welcome to Khadeeja Empire"}</h2>
          {promo.body ? <p className="mt-4 text-sm leading-7 text-muted">{promo.body}</p> : null}
          {promo.couponCode ? <p className="mt-5 border border-dashed border-accent px-4 py-3 text-center text-sm font-semibold tracking-[0.16em] text-primary">{promo.couponCode}</p> : null}
          {promo.ctaLink ? (
            <Link href={promo.ctaLink} onClick={close} className="mt-6 inline-flex min-h-11 items-center justify-center bg-primary px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-primary-hover">
              {promo.ctaLabel || "Explore now"}
            </Link>
          ) : null}
        </div>
        <button type="button" onClick={close} autoFocus className="absolute right-3 top-3 inline-grid h-11 w-11 place-items-center bg-surface-elevated/90 text-ink hover:text-primary" aria-label="Close promotion">
          <X size={19} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
