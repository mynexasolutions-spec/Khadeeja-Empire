"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CraftMark } from "@/components/ui/CraftMark";

const craftImages = [
  "/assets/images/3912472252555175961.jpg",
  "/assets/images/3895371692098630743.jpg",
  "/assets/images/3911022349174249793.jpg",
];

export function CraftStory() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % craftImages.length);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, next]);

  return (
    <section className="relative bg-[#7A1F1F] overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image Slideshow (Order 2 on Mobile, Order 1 on Desktop) */}
          <div className="order-2 lg:order-1 w-full">
            <div
              className="relative aspect-[4/3.2] sm:aspect-square lg:aspect-[5/4] w-[90%] sm:w-full mx-auto rounded-xl sm:rounded-xl overflow-hidden shadow-2xl group border border-white/10 bg-surface/5"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {craftImages.map((src, i) => (
                <div
                  key={i}
                  className={cnFade(i, current)}
                  aria-hidden={i !== current}
                >
                  <Image
                    src={src}
                    alt="Craftsmanship of Banaras — every thread tells a story"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-[10000ms] ease-linear ${i === current ? "scale-110" : "scale-100"}`}
                    priority={i === 0}
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7A1F1F]/80 via-[#7A1F1F]/10 to-transparent opacity-80" />
                </div>
              ))}

              {/* Decorative & Slider Elements */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex items-end justify-between z-10">
                <div className="flex gap-2">
                  {craftImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 hover:bg-white ${
                        idx === current ? "w-8 bg-accent" : "w-2 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text Content (Order 1 on Mobile, Order 2 on Desktop) */}
          <div className="order-1 lg:order-2 flex flex-col items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 max-w-xl mx-auto sm:mx-0">
            <div className="flex flex-col items-center sm:items-start gap-4 w-full">
              <CraftMark
                className="h-12 w-12 sm:h-14 sm:w-14 text-accent mx-auto sm:mx-0"
                tone="turmeric"
              />
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="h-px w-8 bg-accent/60" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Our Heritage
                </p>
                <div className="h-px w-8 bg-accent/60 sm:hidden" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[2.5rem] font-display font-bold leading-[1.15] text-white tracking-tight text-center sm:text-left">
                Every thread{" "}
                <span className="text-accent italic font-serif font-normal">
                  tells a story.
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 text-sm sm:text-base leading-relaxed text-white/75 font-light text-center sm:text-left">
              <p>
                Born in Banaras and made for the modern woman, Khadeeja Empire
                bridges the gap between heritage craft and contemporary
                wardrobes. We believe that comfort and elegance are not mutually
                exclusive.
              </p>
              <p>
                Each piece is designed with intention—breathable fabrics, easy
                silhouettes, and details that honour the artisanal spirit of
                Indian craft. From short kurtis to flowing dresses, our
                collections are made to be worn your way.
              </p>
            </div>

            <div className="pt-4 sm:pt-6 flex justify-center sm:justify-start w-full">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full bg-accent text-primary px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] shadow-lg hover:bg-white hover:text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-95"
              >
                Discover Our Journey
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function cnFade(index: number, current: number) {
  return `absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
    index === current ? "opacity-100 z-10" : "opacity-0 z-0"
  }`;
}
