"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/hooks/useCart";
import { UIProvider } from "@/hooks/useUI";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SearchDrawer } from "./SearchDrawer";
import { CartDrawer } from "./CartDrawer";
import { MobileNav } from "./MobileNav";
import { ToastContainer } from "@/components/ui/Toast";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <UIProvider>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <SearchDrawer />
        <CartDrawer />
        <MobileNav />
        <ToastContainer />
      </UIProvider>
    </CartProvider>
  );
}