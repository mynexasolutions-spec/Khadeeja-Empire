import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category } from "@/types";

const collectionAccents: Record<string, "indigo" | "turmeric" | "madder" | "leaf"> = {
  "short-kurtis": "indigo",
  "coord-sets": "madder",
  "everyday-tops": "leaf",
  dresses: "turmeric",
  "resort-and-whites": "indigo",
  "new-arrivals": "madder",
};

export function CollectionGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Browse"
          title="Shop by Collection"
          description="Explore our curated edits—each collection tells its own story."
          className="mb-12"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group block min-w-0"
              aria-label={`Explore ${cat.name}`}
            >
              <div
                className="collection-card craft-frame group relative aspect-[4/5] overflow-hidden bg-surface"
                data-accent={collectionAccents[cat.slug] ?? "turmeric"}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-surface-elevated">
                  <h3 className="mb-1 font-display text-xl leading-tight md:text-2xl">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-accent opacity-80 transition-opacity group-hover:opacity-100">
                    Explore
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
