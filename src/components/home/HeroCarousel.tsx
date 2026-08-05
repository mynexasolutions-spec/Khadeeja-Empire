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
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    timerRef.current = setInterval(next, 6000);
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

  if (slideCount === 0) return null;

  const activeSlide = slides[current];

  return (
    <section
      className="relative min-h-[70dvh] w-full overflow-hidden bg-bg"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      aria-describedby="hero-carousel-instructions"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocus(false);
        }
      }}
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
      <p id="hero-carousel-instructions" className="sr-only">
        Use the left and right arrow keys to change slides. Use the pause button
        to stop or resume automatic rotation.
      </p>
      <button
        type="button"
        aria-label={
          isManuallyPaused
            ? "Resume automatic slide rotation"
            : "Pause automatic slide rotation"
        }
        aria-pressed={isManuallyPaused}
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-20 focus:min-h-[44px] focus:bg-black/75 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        onClick={() => setIsManuallyPaused((paused) => !paused)}
      >
        {isManuallyPaused ? "Resume rotation" : "Pause rotation"}
      </button>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {slideCount}: {activeSlide.title}
      </p>
      <div
        className="flex min-h-[70dvh] w-full transition-transform duration-700 ease-out motion-reduce:transition-none md:min-h-[80vh]"
        style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
      >
        {slides.map((s, i) => {
          const isActive = i === current;

          return (
            <div
              key={s.id}
              className={cn(
                "relative flex min-h-[70dvh] w-full shrink-0 flex-col overflow-hidden bg-bg md:min-h-[80vh] md:flex-row md:items-stretch",
                !isActive && "pointer-events-none"
              )}
              aria-hidden={!isActive}
              inert={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}: ${s.title}`}
            >
              <div
                className="home-hero-image relative z-10 h-[52dvh] w-full self-end md:min-h-[80vh] md:h-auto md:w-[45%] md:self-stretch"
              >
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className={cn(
                    "object-contain object-bottom md:origin-bottom",
                    i === 0
                      ? "md:scale-[1.45]"
                      : i === 1
                        ? "md:scale-[1.32]"
                        : "md:scale-[1.35]"
                  )}
                  priority={i === 0}
                />
              </div>

              <div className="home-hero-copy flex flex-1 items-center justify-center bg-accent px-6 py-12 text-center md:py-0">
                <div className="flex flex-col items-center text-center">
                  <h2 className="max-w-[10ch] font-display uppercase text-[clamp(2.75rem,7vw,6.25rem)] leading-none tracking-[0.12em] text-primary">
                    {s.title}
                  </h2>
                  <Link
                    href={s.ctaLink}
                    tabIndex={isActive ? undefined : -1}
                    className="mt-8 inline-flex min-h-[44px] items-center rounded-none bg-primary px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-surface-elevated transition-colors hover:bg-primary-hover"
                  >
                    {s.cta}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
