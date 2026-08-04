"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const craftImages = [
  "/assets/images/3912472252555175961.jpg",
  "/assets/images/3890169902981769434.jpg",
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
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Fading image slideshow */}
          <div
            className="relative aspect-[4/5] overflow-hidden bg-surface order-1"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6 order-2">
            <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium">
              Our Craft
            </p>
            <h2 className="text-h1 text-ink leading-[1.15]">
              Every thread tells a story.
            </h2>
            <div className="flex flex-col gap-4 text-muted leading-relaxed">
              <p>
                Born in Banaras and made for the modern woman, Khadeeja Empire
                bridges the gap between heritage craft and contemporary wardrobes.
                We believe that comfort and elegance are not mutually exclusive.
              </p>
              <p>
                Each piece is designed with intention—breathable fabrics, easy
                silhouettes, and details that honour the artisanal spirit of
                Indian craft. From short kurtis to flowing dresses, our
                collections are made to be worn your way.
              </p>
            </div>
            <div>
              <Button href="/about" variant="outline">
                Read Our Story
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function cnFade(index: number, current: number) {
  return `absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
    index === current ? "opacity-100" : "opacity-0"
  }`;
}