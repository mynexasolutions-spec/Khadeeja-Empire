import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandIntro } from "@/components/home/BrandIntro";
import { CollectionGrid } from "@/components/home/CollectionGrid";
import { ProductRail } from "@/components/home/ProductRail";
import { CraftStory } from "@/components/home/CraftStory";
import { ValuesSection } from "@/components/home/ValuesSection";
import { VideoStrip } from "@/components/home/VideoStrip";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BrandIntro />
      <CollectionGrid />
      <ProductRail />
      <CraftStory />
      <ValuesSection />
      <VideoStrip />
      <NewsletterSection />
    </>
  );
}