"use client";

import { Container } from "@/components/ui/Container";
import { brandValues } from "@/content/catalog";
import { Sun, Scissors, Shirt, Sparkles } from "lucide-react";

export function ValuesSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a1128] py-14 sm:py-14 lg:py-16">
      {/* Decorative Background Glows / Waves */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#0d1838] to-[#0a1128] opacity-90 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Golden Leaves (Left) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none hidden lg:block">
        <svg width="120" height="300" viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-20 150 Q 40 120 80 50" stroke="#fcd34d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M10 140 Q 50 110 90 20" stroke="#fcd34d" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-10 160 Q 60 180 110 250" stroke="#fcd34d" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M50 100 Q 70 80 65 55 Q 45 70 50 100" fill="#fcd34d" fillOpacity="0.2" stroke="#fcd34d" strokeWidth="1" />
          <path d="M60 170 Q 90 190 105 230 Q 70 210 60 170" fill="#fcd34d" fillOpacity="0.2" stroke="#fcd34d" strokeWidth="1" />
        </svg>
      </div>

      {/* Decorative Golden Leaves (Right) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none hidden lg:block rotate-180">
        <svg width="120" height="300" viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-20 150 Q 40 120 80 50" stroke="#fcd34d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M10 140 Q 50 110 90 20" stroke="#fcd34d" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-10 160 Q 60 180 110 250" stroke="#fcd34d" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M50 100 Q 70 80 65 55 Q 45 70 50 100" fill="#fcd34d" fillOpacity="0.2" stroke="#fcd34d" strokeWidth="1" />
          <path d="M60 170 Q 90 190 105 230 Q 70 210 60 170" fill="#fcd34d" fillOpacity="0.2" stroke="#fcd34d" strokeWidth="1" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <Sun className="text-amber-300 mb-2 w-6 h-6 drop-shadow-md" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-300 font-bold mb-5 drop-shadow-sm">
            What We Believe
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[2.5rem] font-display font-bold text-white mb-5 drop-shadow-md">
            The Khadeeja Philosophy
          </h2>
          <p className="text-white/70 text-sm sm:text-base font-light max-w-md pt-3">
            Three principles that guide every piece we create.
          </p>
        </div>

        {/* 3 Columns Section */}
        <div className="flex flex-col md:flex-row items-stretch justify-between relative w-full gap-4 md:gap-0">
          {brandValues.map((value, i) => {
            const icons = [<Shirt key={0} strokeWidth={1.5} size={20} />, <Scissors key={1} strokeWidth={1.5} size={20} />, <Sparkles key={2} strokeWidth={1.5} size={20} />];
            return (
              <div
                key={value.title}
                className={`flex-1 flex flex-col items-center text-center px-4 py-4 md:py-2 transition-transform duration-500 hover:-translate-y-2 h-full ${
                  i !== 2 ? "border-b md:border-b-0 md:border-r border-amber-300/20" : ""
                }`}
              >
                {/* Number Circle */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-300/40 flex items-center justify-center text-amber-300 font-display text-sm sm:text-xl mb-4 shadow-[0_0_15px_rgba(252,211,77,0.15)] bg-[#0a1128]/50 backdrop-blur-sm shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <h3 className="text-white font-display text-lg sm:text-xl mb-2 font-medium tracking-wide drop-shadow-sm">
                  {value.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-[320px] mx-auto pt-2 mb-4 font-light">
                  {value.description}
                </p>

                {/* Bottom Icon Circle */}
                <div className="mt-5 w-10 h-10 sm:w-12 sm:h-12 rounded border border-amber-300/30 flex items-center justify-center text-amber-300/80 bg-[#0a1128]/50 backdrop-blur-sm transition-colors hover:bg-amber-300/10 hover:text-amber-300 shrink-0">
                  {icons[i % icons.length]}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
