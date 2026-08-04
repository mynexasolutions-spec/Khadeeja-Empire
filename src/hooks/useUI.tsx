"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DrawerType = "search" | "cart" | "mobile-nav" | null;

interface UIContextValue {
  openDrawer: DrawerType;
  setOpenDrawer: (drawer: DrawerType) => void;
  openSearch: () => void;
  openCart: () => void;
  openMobileNav: () => void;
  closeDrawer: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);

  const value: UIContextValue = {
    openDrawer,
    setOpenDrawer,
    openSearch: () => setOpenDrawer("search"),
    openCart: () => setOpenDrawer("cart"),
    openMobileNav: () => setOpenDrawer("mobile-nav"),
    closeDrawer: () => setOpenDrawer(null),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}