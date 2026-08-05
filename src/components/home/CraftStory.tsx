"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CraftMark } from "@/components/ui/CraftMark";

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
    <section className="home-craft-story bg-primary py-16 text-surface-elevated md:py-24">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Fading image slideshow */}
          <div
            className="craft-frame relative order-1 aspect-[4/5] overflow-hidden border-accent bg-surface"
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
          <div className="order-2 flex flex-col gap-6">
            <CraftMark className="h-12 w-12" tone="turmeric" />
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
              Our Craft
            </p>
            <h2 className="text-h1 leading-[1.15] text-surface-elevated">
              Every thread tells a story.
            </h2>
            <div className="flex flex-col gap-4 leading-relaxed text-surface-elevated/75">
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
              <Button
                href="/about"
                variant="outline"
                className="border-accent text-surface-elevated hover:border-accent hover:bg-accent hover:text-primary"
              >
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
