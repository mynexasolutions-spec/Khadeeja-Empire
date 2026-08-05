"use client";

import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/hooks/useUI";
import { Drawer } from "@/components/ui/Drawer";
import { siteConfig } from "@/content/site";
import type { Category } from "@/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const { openDrawer, closeDrawer } = useUI();
  const open = openDrawer === "mobile-nav";

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      side="left"
      ariaLabel="Navigation menu"
    >
      <div className="p-6 pt-20">
        <Link
          href="/"
          onClick={closeDrawer}
          className="relative h-10 w-10 shrink-0 flex items-center justify-center mb-8 mx-auto"
        >
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            fill
            sizes="40px"
            className="object-contain"
          />
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          <Link
            href="/shop"
            onClick={closeDrawer}
            className="text-lg font-display text-ink py-3 border-b border-border hover:text-primary transition-colors"
          >
            Shop All
          </Link>

          <p className="text-xs uppercase tracking-wider text-muted font-medium pt-4 pb-2">
            Collections
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              onClick={closeDrawer}
              className="text-base text-ink py-2.5 hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}

          <div className="border-t border-border mt-4 pt-4 flex flex-col gap-1">
            <Link
              href="/about"
              onClick={closeDrawer}
              className="text-base text-ink py-2.5 hover:text-primary transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              onClick={closeDrawer}
              className="text-base text-ink py-2.5 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/shipping-returns"
              onClick={closeDrawer}
              className="text-base text-ink py-2.5 hover:text-primary transition-colors"
            >
              Shipping & Returns
            </Link>
          </div>
        </nav>
      </div>
    </Drawer>
  );
}
