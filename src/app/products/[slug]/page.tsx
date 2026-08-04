import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { getProductBySlug, getProductsByCollection, products, formatPrice } from "@/content/catalog";
import { ProductActions } from "@/components/product/ProductActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCollection(product.collection)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 md:py-12">
      <Container>
        <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/collections/${product.collection}`} className="hover:text-ink transition-colors">
            {product.collection.replace(/-/g, " ")}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-product overflow-hidden bg-surface">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {product.video && (
              <div className="relative aspect-product overflow-hidden bg-surface">
                <video
                  src={product.video}
                  poster={product.images[0]}
                  controls
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label={`Video of ${product.name}`}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-muted">
                {product.category.replace(/-/g, " ")}
              </span>
              <h1 className="text-h1 text-ink leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium text-ink">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.priceStatus === "demo" && (
                  <span className="text-xs text-muted">(Demo price — subject to change)</span>
                )}
              </div>
            </div>

            <p className="text-muted leading-relaxed">{product.description}</p>

            <ProductActions product={product} />

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs border border-border text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-h2 mb-8">You May Also Like</h2>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </Container>
    </div>
  );
}
