"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getLatestProducts } from "@/content/catalog";
import { formatPrice } from "@/lib/utils";

export function ProductRail() {
  const products = getLatestProducts(6);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="py-16 md:py-24 bg-surface">
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
              className="inline-flex items-center justify-center w-10 h-10 border border-border hover:border-ink transition-colors rounded"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll products right"
              className="inline-flex items-center justify-center w-10 h-10 border border-border hover:border-ink transition-colors rounded"
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
                className="block relative aspect-product overflow-hidden bg-surface group"
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
                  <span className="absolute top-3 left-3 bg-surface-elevated/95 text-ink text-xs uppercase tracking-wider px-3 py-1 font-medium">
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
                  className="font-display text-lg text-ink hover:text-primary transition-colors leading-snug"
                >
                  {product.name}
                </Link>
                <span className="text-ink font-medium">
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