import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { getProductsByCollection } from "@/content/catalog";
import { getCollectionBySlug, getCategoryBySlug, collections } from "@/content/categories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const category = getCategoryBySlug(slug);
  if (!collection && !category) notFound();

  const products = getProductsByCollection(slug);
  const display = collection || category!;

  return (
    <div>
      <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden bg-surface">
        <Image
          src={display.image}
          alt={display.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-display text-surface-elevated mb-2">{display.name}</h1>
            <p className="text-lead text-surface-elevated/85 max-w-xl">{display.description}</p>
          </div>
        </div>
      </div>
      <Container className="py-12 md:py-16">
        <div className="mb-8">
          <p className="text-muted">{products.length} products</p>
        </div>
        <ProductGrid products={products} columns={4} priorityCount={4} />
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-h3 mb-6">Explore Other Collections</h2>
          <div className="flex flex-wrap gap-3">
            {collections
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="px-4 py-2 text-sm border border-border hover:border-ink transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
