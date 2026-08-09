"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ATELIER_IMAGES = [
  { id: "1", src: "/assets/images/3878031061222144421.jpg", alt: "Khadeeja Empire Design 1" },
  { id: "2", src: "/assets/images/3882847386511339333.jpg", alt: "Khadeeja Empire Design 2" },
  { id: "3", src: "/assets/images/3883868700516753854.jpg", alt: "Khadeeja Empire Design 3" },
  { id: "4", src: "/assets/images/3895371692098630743.jpg", alt: "Khadeeja Empire Design 4" },
  { id: "5", src: "/assets/images/3900319569828324606.jpg", alt: "Khadeeja Empire Design 5" },
  { id: "6", src: "/assets/images/3912472252555175961.jpg", alt: "Khadeeja Empire Design 6" },
  { id: "7", src: "/assets/images/3918399586127244976.jpg", alt: "Khadeeja Empire Design 7" },
  { id: "8", src: "/assets/images/3931104797681236517.jpg", alt: "Khadeeja Empire Design 8" },
];

export function BehindTheAtelier() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="relative py-7 sm:py-10 overflow-hidden bg-surface border-b border-border/60 text-ink">
      {/* Top Badge & Header - Text Centered */}
      <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="h-[1.5px] w-8 bg-primary/40" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Behind the Designs
          </span>
          <span className="h-[1.5px] w-8 bg-primary/40" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[2.5rem] font-display font-bold tracking-tight text-ink leading-[1.15] text-center">
          Curious What Else We&apos;ve Created?
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-muted max-w-xl mx-auto mt-2.5 leading-relaxed text-center">
          Explore more brand identities, packaging, and digital design work in our extended portfolio.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mt-5 mb-6 sm:mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-surface border border-[#0A1129] shadow-md text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:border-[#0A1129] hover:bg-[#0A1129] hover:text-white transition-all duration-300 group hover:shadow-lg active:scale-95"
          >
            <span className="transition-colors duration-300 group-hover:text-white">Shop Now</span>
            <span className="w-6 h-6 rounded-full bg-[#0A1129] text-white group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-3 h-3 text-white group-hover:text-[#0A1129] transition-colors duration-300" />
            </span>
          </Link>
        </div>
      </div>

      {/* Infinite Scroll Perspective Image Carousel */}
      <div className="relative w-full overflow-hidden py-2 my-1">
        {/* Navigation Buttons */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-surface/90 backdrop-blur-md border border-border/80 text-ink shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-surface/90 backdrop-blur-md border border-border/80 text-ink shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>

        {/* Scrollable Track with Infinite Marquee Animation */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar scroll-smooth px-6"
        >
          <div className="marquee-infinite-rtl flex items-center gap-4 sm:gap-5 py-4">
            {[...ATELIER_IMAGES, ...ATELIER_IMAGES].map((img, idx) => {
              // Create subtle perspective arch tilt for cards
              const positionInSet = idx % ATELIER_IMAGES.length;
              const isCenter = positionInSet === 3 || positionInSet === 4;
              const isLeftTilt = positionInSet < 3;
              
              return (
                <div
                  key={`${img.id}-${idx}`}
                  className={cn(
                    "relative w-[150px] sm:w-[190px] md:w-[220px] h-[200px] sm:h-[250px] md:h-[280px] shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-border/40 transition-all duration-500 hover:scale-105 hover:-translate-y-1.5 hover:z-20",
                    isLeftTilt && "transform -rotate-2 scale-95",
                    !isLeftTilt && !isCenter && "transform rotate-2 scale-95",
                    isCenter && "transform scale-100 shadow-2xl"
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 190px, 220px"
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 text-center">
                    <span className="text-white text-[11px] font-semibold tracking-wider uppercase text-center">
                      Khadeeja Edit #{positionInSet + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

