"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AdminHeader } from "./Header";
import { AdminSidebar } from "./Sidebar";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const drawer = document.getElementById("admin-navigation");
    const trigger = document.querySelector<HTMLButtonElement>(
      'button[aria-controls="admin-navigation"]'
    );
    document.body.style.overflow = "hidden";
    drawer?.querySelector<HTMLButtonElement>(".admin-mobile-close")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
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
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [mobileOpen]);

  return (
    <div className="admin-shell">
      <Toaster position="top-right" richColors closeButton />
      <a href="#admin-main" className="admin-skip-link">Skip to admin content</a>
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="admin-workspace">
        <AdminHeader email={email} menuOpen={mobileOpen} onMenuOpen={() => setMobileOpen(true)} />
        <main id="admin-main" className="admin-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}

export default AdminShell;
