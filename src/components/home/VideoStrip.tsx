"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getInstagramFeed } from "@/content/instagram";

export function VideoStrip() {
  const posts = getInstagramFeed(8);

  return (
    <section className="py-16 md:py-24 bg-surface">
      <Container>
        <SectionHeading
          eyebrow="Follow Along"
          title="@khadeejaempire"
          description="Real pieces, real moments. Tag us to be featured."
          className="mb-10"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square overflow-hidden bg-bg group rounded-sm"
            >
              {post.video ? (
                <video
                  src={post.video}
                  poster={post.image}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={post.image}
                  alt={post.caption.slice(0, 80)}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}