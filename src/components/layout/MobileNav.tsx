"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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
            href="/"
            onClick={closeDrawer}
            className="text-lg font-display text-ink py-3 border-b border-border hover:text-primary transition-colors"
          >
            Home
          </Link>

          <details className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-lg font-display text-ink transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              Shop
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="flex flex-col pb-3 pl-3">
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="py-2.5 text-base font-medium text-ink transition-colors hover:text-primary"
              >
                Shop All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/collections/${cat.slug}`}
                  onClick={closeDrawer}
                  className="py-2.5 text-base text-ink transition-colors hover:text-primary"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </details>

          <details className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-lg font-display text-ink transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              Support
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="flex flex-col pb-3 pl-3">
              <Link
                href="/contact"
                onClick={closeDrawer}
                className="py-2.5 text-base text-ink transition-colors hover:text-primary"
              >
                Contact Us
              </Link>
              <Link
                href="/shipping-returns"
                onClick={closeDrawer}
                className="py-2.5 text-base text-ink transition-colors hover:text-primary"
              >
                Refund &amp; Shipping Policies
              </Link>
            </div>
          </details>

          <div className="flex flex-col gap-1 pt-1">
            <Link
              href="/about"
              onClick={closeDrawer}
              className="py-3 text-lg font-display text-ink border-b border-border hover:text-primary transition-colors"
            >
              Story
            </Link>
            <Link
              href="/contact"
              onClick={closeDrawer}
              className="py-3 text-lg font-display text-ink hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </Drawer>
  );
}
