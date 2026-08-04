import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story of Khadeeja Empire — modern Indian womenswear rooted in craft.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="relative w-full h-[40vh] min-h-[280px] overflow-hidden bg-surface">
        <Image
          src="/assets/images/3912472252555175961.jpg"
          alt="Khadeeja Empire craftsmanship"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-display text-surface-elevated">Our Story</h1>
          </div>
        </div>
      </div>

      <Container className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium">Khadeeja Empire</p>
            <h2 className="text-h1 text-ink leading-[1.15]">
              Rooted in Indian craft. Designed for the way women dress now.
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-muted leading-relaxed">
            <p>
              Khadeeja Empire is an elegant Indian womenswear brand born in Banaras.
              We create pieces that bridge heritage craft and contemporary wardrobes—comfortable,
              wearable, and made to be lived in.
            </p>
            <p>
              Every piece is designed with intention. We believe that comfort and elegance
              are not mutually exclusive, and that modern Indian dressing should feel effortless.
            </p>
            <p>
              From short kurtis to flowing dresses, from co-ord sets to resort whites, our
              collections celebrate the artisanal spirit of Banaras while embracing the way
              women dress today.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 py-8 border-y border-border">
            <div className="flex flex-col gap-2">
              <span className="font-display text-3xl text-accent">01</span>
              <h3 className="text-h3 text-ink">Easy Silhouettes</h3>
              <p className="text-sm text-muted">Breathable, comfortable, made for real life.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-display text-3xl text-accent">02</span>
              <h3 className="text-h3 text-ink">Crafted Details</h3>
              <p className="text-sm text-muted">Handcrafted in Banaras with attention to every seam.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-display text-3xl text-accent">03</span>
              <h3 className="text-h3 text-ink">Worn Your Way</h3>
              <p className="text-sm text-muted">Versatile by design. Your wardrobe, your rules.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button href="/shop" variant="outline">Explore Our Collections</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
