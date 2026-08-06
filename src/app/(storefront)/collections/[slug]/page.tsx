import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { getDataProvider } from "@/lib/data";
import { toStorefrontCategory, toStorefrontCollection, toStorefrontProduct } from "@/lib/storefront/adapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getDataProvider();
  const display = (await provider.getCollection(slug)) ?? (await provider.getCategory(slug));

  return display
    ? { title: display.name, description: display.description || undefined }
    : { title: "Collection Not Found" };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = getDataProvider();
  const [collectionRecord, categoryRecord, productRecords, allCollections] = await Promise.all([
    provider.getCollection(slug),
    provider.getCategory(slug),
    provider.listProducts({ active: true }),
    provider.listCollections({ active: true }),
  ]);

  if (!collectionRecord && !categoryRecord) notFound();

  const display = collectionRecord
    ? toStorefrontCollection(collectionRecord)
    : toStorefrontCategory(categoryRecord!);
  const products = productRecords
    .filter(
      (product) =>
        product.collectionSlug === slug ||
        product.collection?.slug === slug ||
        product.categorySlug === slug ||
        product.category?.slug === slug
    )
    .map(toStorefrontProduct);
  const otherCollections = allCollections.filter((collection) => collection.slug !== slug);

  return (
    <div className="py-12 md:py-16">
      <Container>
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-h1 text-ink">{display.name}</h1>
          <p className="text-muted">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </header>

        {otherCollections.length > 0 && (
          <nav className="mb-10" aria-labelledby="other-collections-heading">
            <h2 id="other-collections-heading" className="mb-4 text-h3 text-ink">
              Explore other collections
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="border border-border px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} priorityCount={4} />
        ) : (
          <div className="py-12 text-center text-muted">
            No active products in this collection yet.
          </div>
        )}
      </Container>
    </div>
  );
}
