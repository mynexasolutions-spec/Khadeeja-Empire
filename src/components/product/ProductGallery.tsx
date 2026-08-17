"use client";

import Image from "next/image";
import { ChevronDown, Heart, Play } from "lucide-react";
import { useState, type TouchEvent } from "react";

interface ProductGalleryProps {
  images: string[];
  video?: string | null;
  productName: string;
}

type Slide = { type: "image" | "video"; src: string };

const SWIPE_THRESHOLD = 45;

export function ProductGallery({ images, video, productName }: ProductGalleryProps) {
  const slides: Slide[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const hasMultipleSlides = slides.length > 1;

  const selectSlide = (index: number) => {
    if (!slides.length) return;
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null || !hasMultipleSlides) return;
    const distance = touchStart - (event.changedTouches[0]?.clientX ?? touchStart);
    setTouchStart(null);

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    selectSlide(activeIndex + (distance > 0 ? 1 : -1));
  };

  if (!slides.length) {
    return (
      <div className="grid aspect-product place-items-center bg-surface text-sm text-muted rounded-sm">
        Image coming soon
      </div>
    );
  }

  const activeSlide = slides[activeIndex];

  return (
    <section aria-label={`${productName} image gallery`}>
      {/* Desktop: vertical thumbnail strip + main image */}
      <div className="hidden md:flex gap-4">
        {/* Thumbnail strip */}
        <div className="flex flex-col gap-3 w-[80px] flex-shrink-0 relative">
          {slides.map((slide, index) => (
            <button
              key={`${slide.src}-thumb-${index}`}
              type="button"
              onClick={() => selectSlide(index)}
              className={`relative w-full aspect-[4/5] overflow-hidden bg-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                activeIndex === index
                  ? "ring-1 ring-[var(--color-maroon)]"
                  : "hover:opacity-80"
              }`}
              style={{
                border: activeIndex === index
                  ? "2px solid var(--color-maroon)"
                  : "1px solid var(--color-border)",
              }}
              aria-label={slide.type === "video" ? "Show product video" : `Show image ${index + 1} of ${images.length}`}
              aria-current={activeIndex === index ? "true" : undefined}
            >
              {slide.type === "video" ? (
                <>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={slide.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play size={16} className="text-white fill-white" strokeWidth={0} />
                  </span>
                </>
              ) : (
                <Image src={slide.src} alt="" fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1 aspect-[3/4] bg-surface-elevated overflow-hidden rounded-sm">
          <div className="relative w-full h-full">
            {activeSlide.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={activeSlide.src}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={activeSlide.src}
                alt={`${productName}, view ${activeIndex + 1}`}
                fill
                sizes="50vw"
                className="object-cover object-top"
                priority={activeIndex === 0}
              />
            )}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={() => setWishlist(!wishlist)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-border shadow-sm transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlist}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={
                wishlist
                  ? "fill-[var(--color-maroon)] text-[var(--color-maroon)]"
                  : "text-[var(--color-muted)]"
              }
            />
          </button>
        </div>
      </div>

      {/* Mobile: main image + horizontal thumbnails below */}
      <div className="md:hidden">
        <div className="relative aspect-product bg-surface-elevated overflow-hidden rounded-sm">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, index) => (
              <div key={`${slide.src}-${index}`} className="relative h-full min-w-full flex-shrink-0">
                {slide.type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={slide.src}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <Image
                      src={slide.src}
                      alt=""
                      fill
                      sizes="100vw"
                      aria-hidden="true"
                      className="pointer-events-none scale-110 object-cover blur-2xl opacity-100"
                    />
                    <Image
                      src={slide.src}
                      alt={`${productName}${index ? `, view ${index + 1}` : ""}`}
                      fill
                      sizes="100vw"
                      className="object-cover object-top"
                      priority={index === 0}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={() => setWishlist(!wishlist)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-border shadow-sm transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlist}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={
                wishlist
                  ? "fill-[var(--color-maroon)] text-[var(--color-maroon)]"
                  : "text-[var(--color-muted)]"
              }
            />
          </button>
        </div>

        {hasMultipleSlides ? (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-thumb-mobile-${index}`}
                type="button"
                onClick={() => selectSlide(index)}
                className={`relative h-16 w-12 flex-shrink-0 overflow-hidden bg-surface transition ${
                  activeIndex === index
                    ? "ring-1 ring-[var(--color-maroon)]"
                    : "opacity-65 hover:opacity-100"
                }`}
                style={{
                  border: activeIndex === index
                    ? "2px solid var(--color-maroon)"
                    : "1px solid var(--color-border)",
                }}
                aria-label={slide.type === "video" ? "Show product video" : `Show image ${index + 1} of ${images.length}`}
                aria-current={activeIndex === index ? "true" : undefined}
              >
                {slide.type === "video" ? (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video src={slide.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play size={12} className="text-white fill-white" strokeWidth={0} />
                    </span>
                  </>
                ) : (
                  <Image src={slide.src} alt="" fill sizes="48px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <span className="sr-only" aria-live="polite">
        {activeSlide.type === "video" ? "Product video" : `Image ${activeIndex + 1} of ${images.length}`}
      </span>
    </section>
  );
}
