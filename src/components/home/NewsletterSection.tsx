"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import { Sun, Mail, ArrowRight, BookOpen, Tag, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/storefront/submissions";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0].message);
      return;
    }
    startTransition(async () => {
      const response = await subscribeToNewsletter({ email: result.data.email });
      setStatus(response.ok ? "success" : "error");
      setMessage(response.message);
      if (response.ok) setEmail("");
    });
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <Container>
        <div className="relative w-full max-w-[1200px] mx-auto rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-[#e5dfd3] bg-[#fcfaf7] shadow-[0_12px_45px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Background Decorative Patterns */}
          {/* Left Dot Matrix */}
          <div className="absolute top-8 left-6 sm:left-10 pointer-events-none opacity-40 hidden sm:block">
            <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
              <pattern id="dot-matrix-left" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="#d5c0a3" />
              </pattern>
              <rect width="80" height="120" fill="url(#dot-matrix-left)" />
            </svg>
          </div>

          {/* Right Dot Matrix */}
          <div className="absolute bottom-8 right-6 sm:right-10 pointer-events-none opacity-40 hidden sm:block">
            <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
              <pattern id="dot-matrix-right" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="#d5c0a3" />
              </pattern>
              <rect width="80" height="120" fill="url(#dot-matrix-right)" />
            </svg>
          </div>

          {/* Top Right Radial Sunburst */}
          <div className="absolute -top-10 -right-10 w-48 h-48 pointer-events-none opacity-30 hidden lg:block">
            <svg viewBox="0 0 200 200" fill="none">
              <g stroke="#d5c0a3" strokeWidth="0.8">
                {Array.from({ length: 16 }).map((_, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={100 + 90 * Math.cos((i * Math.PI) / 8)}
                    y2={100 + 90 * Math.sin((i * Math.PI) / 8)}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto text-center flex flex-col items-center">
            
            {/* Top Sun Icon & Sub-Badge */}
            <div className="flex flex-col items-center mb-3">
              <div className="text-[#b89565] mb-2">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 sm:w-8 bg-[#d5c0a3]" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#b89565]">
                  Stay Connected
                </span>
                <span className="h-px w-6 sm:w-8 bg-[#d5c0a3]" />
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[2.5rem] font-display font-bold text-[#142340] leading-[1.15] tracking-tight mb-3">
              Join the{" "}
              <span className="italic font-serif font-light text-[#b89565]">
                Khadeeja Empire
              </span>{" "}
              world
            </h2>

            {/* Diamond Sparkle Divider */}
            <div className="text-[#b89565] text-xs my-1">✦</div>

            {/* Description Subtitle */}
            <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-slate-600 max-w-xl mx-auto mb-8">
              Be the first to discover new collections, stories from Banaras, and exclusive previews. No spam—just beautiful things.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto my-5" noValidate>
              <div className="relative flex items-center bg-white rounded sm:rounded-xl border border-[#e5dfd3] p-1.5 shadow-sm focus-within:border-[#b89565] focus-within:ring-2 focus-within:ring-[#b89565]/20 transition-all duration-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#b89565] ml-3.5 sm:ml-4 shrink-0" strokeWidth={1.5} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  aria-invalid={status === "error"}
                  aria-describedby="newsletter-msg"
                  disabled={pending}
                  required
                  className="w-full bg-transparent px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#142340] placeholder:text-slate-400 border-none !outline-none focus:!outline-none focus-visible:!outline-none focus-visible:!ring-0 shadow-none"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  disabled={pending}
                  className="bg-[#142340] hover:bg-[#b89565] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2 shrink-0 group active:scale-95 disabled:opacity-70"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <p
                  id="newsletter-msg"
                  className={`mt-2.5 text-xs text-center font-medium ${
                    status === "error" ? "text-red-600" : "text-emerald-700 flex items-center justify-center gap-1.5"
                  }`}
                  role={status === "error" ? "alert" : "status"}
                >
                  {status === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {message}
                </p>
              )}
            </form>

            {/* Bottom 4 Feature Cards */}
            <div className="w-full mt-2 sm:mt-5 pt-6 sm:pt-8 border-t border-[#e5dfd3]/70 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 divide-y sm:divide-y-0 md:divide-x divide-[#e5dfd3]/60">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-3 justify-start sm:justify-center p-2 pt-3 sm:pt-2">
                <div className="w-10 h-10 rounded-full bg-[#f5ebd9] border border-[#e5dfd3] flex items-center justify-center text-[#b89565] shrink-0">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#142340]">New Collections</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-light">Be the first to shop</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 justify-start sm:justify-center p-2 pt-3 sm:pt-2 md:pl-4 lg:pl-6">
                <div className="w-10 h-10 rounded-full bg-[#f5ebd9] border border-[#e5dfd3] flex items-center justify-center text-[#b89565] shrink-0">
                  <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#142340]">Stories from Banaras</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-light">Culture, craft & more</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 justify-start sm:justify-center p-2 pt-3 sm:pt-2 md:pl-4 lg:pl-6">
                <div className="w-10 h-10 rounded-full bg-[#f5ebd9] border border-[#e5dfd3] flex items-center justify-center text-[#b89565] shrink-0">
                  <Tag className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#142340]">Exclusive Previews</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-light">Special drops & offers</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3 justify-start sm:justify-center p-2 pt-3 sm:pt-2 md:pl-4 lg:pl-6">
                <div className="w-10 h-10 rounded-full bg-[#f5ebd9] border border-[#e5dfd3] flex items-center justify-center text-[#b89565] shrink-0">
                  <Heart className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#142340]">No Spam</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-light">Only good things</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}

