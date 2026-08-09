"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Sun, Sparkles, ArrowRight, Truck, Scissors } from "lucide-react";

export function BrandIntro() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-16 bg-white overflow-hidden">
      <Container>
        <div className="relative w-full max-w-[1200px] mx-auto rounded-2xl sm:rounded-3xl border border-[#e5dfd3] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] bg-[#fcfaf7] flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Content */}
          <div className="flex-1 p-7 sm:p-9 lg:p-12 xl:p-14 flex flex-col items-center sm:items-start justify-center text-center sm:text-left relative z-10">
            
            {/* Top Badge */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-[#f5ebd9] text-[#b89565] p-2 rounded-lg border border-[#e5dfd3]/50 shadow-xs">
                <Sun className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] border border-[#e5dfd3]/80 shadow-xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#b89565]" />
                Khadeeja Empire Atelier
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-center sm:text-left text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-display font-bold text-[#142340] leading-[1.18] tracking-tight mb-4">
              Rooted in Indian craft. <br />
              <span className="italic font-serif font-light text-[#b89565] block mt-2 sm:inline">
                Designed for the way women dress now.
              </span>
            </h2>

            {/* Description */}
            <p className="text-center sm:text-left text-xs sm:text-sm md:text-base font-light leading-relaxed text-slate-600 max-w-lg mx-auto sm:mx-0 my-3 py-2">
              From the artisanal spirit of Banaras to wardrobes across India, every
              piece is crafted with intention—comfortable, wearable, and made to
              be lived in.
            </p>

            {/* Micro Feature Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-7">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e5dfd3] shadow-xs">
                <Sun className="w-4 h-4 text-[#b89565]" strokeWidth={1.5} />
                <span className="text-xs font-medium text-slate-700">Handcrafted in Banaras</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e5dfd3] shadow-xs">
                <Scissors className="w-4 h-4 text-[#b89565]" strokeWidth={1.5} />
                <span className="text-xs font-medium text-slate-700">Made to Order</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e5dfd3] shadow-xs">
                <Truck className="w-4 h-4 text-[#b89565]" strokeWidth={1.5} />
                <span className="text-xs font-medium text-slate-700">Pan-India Express Delivery</span>
              </div>
            </div>

            {/* CTA Link */}
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#142340] hover:text-[#b89565] hover:gap-3.5 transition-all duration-300 group text-center self-center sm:self-start"
            >
              <span>Our Artisanal Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#b89565]" />
            </Link>

            {/* Golden Floral Decor */}
            <div className="absolute right-2 bottom-0 opacity-80 pointer-events-none hidden md:block">
              <svg width="110" height="205" viewBox="0 0 80 150" fill="none">
                <path d="M40 150 Q40 80 0 50" stroke="#d5c0a3" strokeWidth="1.5" fill="none" />
                <path d="M40 120 Q60 100 80 60" stroke="#d5c0a3" strokeWidth="1" fill="none" />
                <path d="M20 90 Q30 70 25 50" fill="#d5c0a3" fillOpacity="0.3" stroke="#d5c0a3" strokeWidth="1" />
                <path d="M45 100 Q60 80 75 90" fill="#d5c0a3" fillOpacity="0.3" stroke="#d5c0a3" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-[40%] h-64 sm:h-80 lg:h-auto min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] xl:min-h-[460px] overflow-hidden order-first lg:order-last shrink-0">
            {/* The SVG mask to create the C-curve from cream background */}
            <div className="absolute top-0 bottom-0 left-0 w-14 lg:w-[105px] z-10 text-[#fcfaf7] hidden lg:block">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                <path d="M0,0 C100,20 100,80 0,100 Z" />
              </svg>
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-14 lg:w-[105px] z-20 hidden lg:block pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 C100,20 100,80 0,100" fill="none" stroke="#d4c6b1" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <Image 
              src="/assets/images/3918399586127244976.jpg"
              alt="Women in traditional attire"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}




