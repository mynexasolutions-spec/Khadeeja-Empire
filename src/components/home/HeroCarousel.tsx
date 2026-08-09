"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const slideCount = slides.length;

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

  const previous = useCallback(() => {
    setCurrent((c) => (c - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (
      reducedMotion ||
      isHovered ||
      hasFocus ||
      isManuallyPaused ||
      slideCount < 2
    ) {
      return;
    }
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasFocus, isHovered, isManuallyPaused, next, reducedMotion, slideCount]);

  useEffect(() => {
    if (current >= slideCount && slideCount > 0) setCurrent(0);
  }, [current, slideCount]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        previous();
      }
    }
    touchStartX.current = null;
  };

  if (slideCount === 0) return null;

  const activeSlide = slides[current];

  return (
    <section
      className="relative min-h-[70dvh] md:min-h-[80vh] w-full overflow-hidden bg-bg group/carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocus(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      {/* Previous / Next Chevron Buttons for Desktop */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface/85 backdrop-blur-md border border-border/60 text-ink shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95 opacity-90 hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface/85 backdrop-blur-md border border-border/60 text-ink shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95 opacity-90 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          </button>
        </>
      )}

      {/* Main Track Slider */}
      <div
        className="flex min-h-[70dvh] md:min-h-[80vh] w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
      >
        {slides.map((s, i) => {
          const isActive = i === current;

          return (
            <div
              key={s.id}
              className={cn(
                "relative flex min-h-[70dvh] md:min-h-[80vh] w-full shrink-0 flex-col overflow-hidden bg-bg md:flex-row md:items-stretch",
                !isActive && "pointer-events-none"
              )}
              aria-hidden={!isActive}
              inert={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}: ${s.title}`}
            >
              {/* Slide Image Container */}
              <div className="home-hero-image relative z-10 h-[52dvh] w-full self-end md:min-h-[80vh] md:h-auto md:w-[45%] md:self-stretch flex items-end justify-center">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className={cn(
                    "object-contain object-bottom md:origin-bottom transition-transform duration-1000 ease-out",
                    isActive ? "scale-100" : "scale-95",
                    i === 0
                      ? "md:scale-[1.45]"
                      : i === 1
                        ? "md:scale-[1.32]"
                        : "md:scale-[1.35]"
                  )}
                  priority={i === 0}
                />
              </div>

              {/* Slide Copy Container */}
              <div className="home-hero-copy flex flex-1 items-center justify-center bg-accent px-6 py-12 text-center relative z-10 md:py-0">
                <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                  {s.subtitle && (
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary/80 mb-2">
                      {s.subtitle}
                    </span>
                  )}
                  <h2 className="max-w-[10ch] font-display uppercase text-[clamp(2.75rem,7vw,6.25rem)] leading-none tracking-[0.12em] text-primary">
                    {s.title}
                  </h2>
                  <Link
                    href={s.ctaLink}
                    tabIndex={isActive ? undefined : -1}
                    className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-surface-elevated transition-all duration-300 hover:bg-primary-hover hover:gap-3.5 hover:shadow-xl active:scale-95"
                  >
                    <span>{s.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Modern Controls Bar */}
      {slideCount > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-border/60 shadow-lg">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === current
                    ? "w-7 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/60"
                )}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono font-medium text-ink/70 border-l border-border/80 pl-2">
            0{current + 1} / 0{slideCount}
          </span>

          <button
            type="button"
            onClick={() => setIsManuallyPaused((p) => !p)}
            aria-label={isManuallyPaused ? "Resume rotation" : "Pause rotation"}
            className="text-ink/70 hover:text-primary transition-colors p-0.5"
          >
            {isManuallyPaused ? (
              <Play size={12} fill="currentColor" />
            ) : (
              <Pause size={12} fill="currentColor" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}


