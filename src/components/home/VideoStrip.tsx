"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { InstagramPost } from "@/types";

export function VideoStrip({ posts }: { posts: InstagramPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="paper-grain bg-surface py-16 md:py-24">
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
              className="craft-frame group relative aspect-square overflow-hidden rounded-none bg-bg"
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
