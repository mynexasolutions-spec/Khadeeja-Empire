"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useUI } from "@/hooks/useUI";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function SearchDrawer({ products }: { products: Product[] }) {
  const { openDrawer, closeDrawer } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => [product.name, product.category, product.collection, ...product.tags].some((value) => value.toLowerCase().includes(normalized))).slice(0, 6);
  }, [products, query]);

  return (
    <Drawer
      open={openDrawer === "search"}
      onClose={closeDrawer}
      side="right"
      ariaLabel="Search products"
    >
      <div className="p-6">
        <h2 className="text-h3 mb-4">Search</h2>
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search size={20} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, categories, tags…"
            aria-label="Search products"
            className="flex-1 text-base bg-transparent outline-none placeholder:text-muted"
          />
        </div>

        <div className="mt-6" aria-live="polite">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="text-muted text-sm py-8 text-center">
              No products found for &ldquo;{query}&rdquo;
            </p>
          )}

          {query.trim().length < 2 && (
            <p className="text-muted text-sm py-8 text-center">
              Start typing to search our collection
            </p>
          )}

          {results.length > 0 && (
            <ul className="flex flex-col gap-1">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeDrawer}
                    className="flex items-center gap-4 p-3 hover:bg-bg transition-colors rounded"
                  >
                    <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-surface">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs uppercase tracking-wide text-muted">
                        {product.category.replace(/-/g, " ")}
                      </span>
                      <span className="font-display text-base text-ink truncate">
                        {product.name}
                      </span>
                      <span className="text-sm text-ink font-medium">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim().length >= 2 && results.length > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={closeDrawer}
              className="block mt-4 text-sm text-primary hover:text-primary-hover transition-colors text-center"
            >
              View all results →
            </Link>
          )}
        </div>
      </div>
    </Drawer>
  );
}
