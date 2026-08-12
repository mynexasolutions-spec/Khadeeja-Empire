"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types";

export function NewCollection({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-surface py-8 md:py-12 overflow-hidden relative">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6 md:gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight size={14} className="text-accent opacity-60 rotate-180 md:hidden" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                NEW COLLECTION
              </span>
              <ChevronLeft size={14} className="text-accent opacity-60 rotate-180 md:hidden" />
            </div>

            <h2 className="text-3xl md:text-[40px] md:leading-[44px] font-display font-medium text-ink mb-3 md:mb-4">
              New Collection
            </h2>

            <p className="text-sm md:text-base text-muted">
              Fresh styles, timeless craftsmanship. Discover our latest collection.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:justify-end shrink-0 gap-4">
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-surface border border-[#0A1129] shadow-md text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:border-[#0A1129] hover:bg-[#0A1129] hover:text-white transition-all duration-300 group hover:shadow-lg active:scale-95"
            >
              <span className="transition-colors duration-300 group-hover:text-white">Shop The Collection</span>
              <span className="w-6 h-6 rounded-full bg-[#0A1129] text-white group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-3 h-3 text-white group-hover:text-[#0A1129] transition-colors duration-300" />
              </span>
            </Link>

            {/* Desktop Navigation removed as per request to move them to sides */}
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative group/carousel">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-30 flex w-9 h-9 md:w-10 md:h-10 items-center justify-center rounded-full border border-border/80 bg-white/95 md:bg-surface text-ink shadow-xl md:shadow-md backdrop-blur-md active:scale-90 transition-all duration-300 hover:bg-accent hover:text-white"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-30 flex w-9 h-9 md:w-10 md:h-10 items-center justify-center rounded-full border border-border/80 bg-white/95 md:bg-surface text-ink shadow-xl md:shadow-md backdrop-blur-md active:scale-90 transition-all duration-300 hover:bg-accent hover:text-white"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {/* Product Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-5 sm:px-6 md:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
                className="shrink-0 w-[60vw] sm:w-[220px] md:w-[240px] lg:w-[250px] snap-start"
                imageClassName="aspect-square sm:aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
