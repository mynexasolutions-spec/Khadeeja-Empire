"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductRail({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.5;
    container.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="paper-grain bg-surface py-16 md:py-24">
      <Container>
        <div className="flex items-end justify-between mb-10 gap-4">
          <SectionHeading
            eyebrow="Just In"
            title="Latest Arrivals"
            align="left"
            className="mb-0"
          />
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll products left"
              className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-border-strong transition-colors hover:border-primary hover:bg-accent/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll products right"
              className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-border-strong transition-colors hover:border-primary hover:bg-accent/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Product rail — contained within same Container padding */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          aria-label="Latest products"
        >
          {products.map((product) => (
            <article
              key={product.id}
              className="flex-shrink-0 w-[60vw] sm:w-[40vw] md:w-[260px] lg:w-[240px] snap-start"
            >
              <Link
                href={`/products/${product.slug}`}
                className="craft-frame group relative block aspect-product overflow-hidden bg-surface"
                aria-label={`View ${product.name}`}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 60vw, 240px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute left-3 top-3 bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                    {product.badge === "new" && "New"}
                    {product.badge === "featured" && "Featured"}
                  </span>
                )}
              </Link>
              <div className="flex flex-col gap-1 pt-3">
                <span className="text-xs uppercase tracking-wide text-muted">
                  {product.category.replace(/-/g, " ")}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="font-display text-lg leading-snug text-primary transition-colors hover:text-accent"
                >
                  {product.name}
                </Link>
                <span className="font-medium text-primary">
                  {formatPrice(product.price, product.currency)}
                  {product.priceStatus === "demo" && (
                    <span className="text-xs text-muted ml-2">(Demo)</span>
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button href="/shop" variant="outline">
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );
}
