"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { heroSlides } from "@/content/catalog";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = heroSlides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (reducedMotion) return;
    timerRef.current = setInterval(next, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reducedMotion, next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-bg"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="grid md:grid-cols-2 min-h-[70dvh] md:min-h-[80vh]">
        {/* Text side */}
        <div className="flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 md:py-0 order-2 md:order-1 bg-bg">
          <div key={current} className="max-w-lg animate-fade-in">
            <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium mb-4">
              {slide.collection.replace(/-/g, " ")}
            </p>
            <h1 className="text-display text-ink mb-6 leading-[1.05]">
              {slide.title}
            </h1>
            <p className="text-lead text-muted mb-8 max-w-md leading-relaxed">
              {slide.subtitle}
            </p>
            <Link
              href={slide.ctaLink}
              className="hero-cta inline-flex items-center justify-center gap-2 min-h-[44px] px-8 text-sm font-medium uppercase tracking-wide"
            >
              {slide.cta}
            </Link>
          </div>
        </div>

        {/* Image side */}
        <div className="relative order-1 md:order-2 min-h-[40dvh] md:min-h-0">
          {heroSlides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
                i === current ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={i !== current}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}: ${s.title}`}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2 bg-bg py-4">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            aria-current={i === current}
            className={cn(
              "h-1 transition-all duration-500 rounded-full",
              i === current
                ? "w-12 bg-ink"
                : "w-6 bg-border hover:bg-border-strong"
            )}
          />
        ))}
      </div>
    </section>
  );
}
