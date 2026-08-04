"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Mail,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useUI } from "@/hooks/useUI";
import { useCart } from "@/hooks/useCart";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { BrandLogo } from "./BrandLogo";

const navigationIcons = {
  Shop: ShoppingBag,
  Collections: Sparkles,
  Story: BookOpen,
  Contact: Mail,
};

export function Header() {
  const pathname = usePathname();
  const { openSearch, openCart, openMobileNav } = useUI();
  const { itemCount } = useCart();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMegaMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    closeTimer.current = setTimeout(() => setMegaMenuOpen(false), 150);
  };

  return (
    <header className="sticky-header site-header">
      <div className="nav">
        <Link
          href="/"
          className="logo logo-image"
          aria-label={`${siteConfig.name} home`}
        >
          <BrandLogo variant="navbar" />
        </Link>

        <nav className="desktop-nav-pill" aria-label="Main navigation">
          {siteConfig.navigation.map((item) => {
            const Icon =
              navigationIcons[item.label as keyof typeof navigationIcons] ??
              Sparkles;
            const isActive =
              pathname === item.href ||
              (item.href !== "/shop" && pathname.startsWith(item.href));

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={item.megaMenu ? openMegaMenu : undefined}
                onMouseLeave={item.megaMenu ? closeMegaMenu : undefined}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "nav-link-item",
                    isActive && "active"
                  )}
                  onFocus={item.megaMenu ? openMegaMenu : undefined}
                  onBlur={item.megaMenu ? closeMegaMenu : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.megaMenu && (
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200",
                        megaMenuOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {item.megaMenu && megaMenuOpen && (
                  <div className="absolute left-0 top-full z-10 pt-2">
                    <div className="bg-surface border border-border shadow-md min-w-[240px] py-4">
                      <p className="px-6 pb-3 text-xs uppercase tracking-wider text-muted font-medium">
                        {item.megaMenu.title}
                      </p>
                      <ul className="flex flex-col">
                        {item.megaMenu.links.map((link, index) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "block px-6 py-2.5 text-sm text-ink hover:bg-bg hover:text-primary transition-colors",
                                index === 0 &&
                                  "font-medium border-b border-border mb-1"
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="nav-cta">
          <IconButton
            onClick={openSearch}
            ariaLabel="Search products"
            className="nav-icon-btn"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </IconButton>
          <IconButton
            onClick={openCart}
            ariaLabel={`Open cart, ${itemCount} items`}
            className="nav-icon-btn"
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="nav-cart-badge">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </span>
          </IconButton>
          <IconButton
            onClick={openMobileNav}
            ariaLabel="Open menu"
            className="nav-icon-btn mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
