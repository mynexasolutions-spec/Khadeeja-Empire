import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeReference } from "@/components/product/SizeReference";
import { StyleDetails } from "@/components/product/StyleDetails";
import {
  DEFAULT_SIZE_CHART_MEASUREMENTS,
  SizeChart,
} from "@/components/product/SizeChart";
import { getDataProvider } from "@/lib/data";
import { toStorefrontProduct } from "@/lib/storefront/adapters";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await getDataProvider().getProduct(slug);
  if (!record) return { title: "Product Not Found" };
  return {
    title: record.seo?.title || record.name,
    description: record.seo?.description || record.description || undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = getDataProvider();
  const record = await provider.getProduct(slug);

  if (!record || record.active === false) notFound();

  const product = toStorefrontProduct(record);
  const related = (await provider.listProducts({ active: true }))
    .filter(
      (p) =>
        p.id !== record.id &&
        (p.collectionSlug === record.collectionSlug ||
          p.categorySlug === record.categorySlug)
    )
    .slice(0, 4)
    .map(toStorefrontProduct);

  return (
    <div className="py-12 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-xs text-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <Link
            href={`/collections/${product.collection}`}
            className="hover:text-ink transition-colors"
          >
            {product.collection.replace(/-/g, " ")}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Main Two-Column Layout */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {/* LEFT COLUMN: Gallery + Size Reference */}
          <div className="flex flex-col">
            <ProductGallery images={product.images} productName={product.name} />
            <SizeReference
              measurements={record.information?.measurements ?? DEFAULT_SIZE_CHART_MEASUREMENTS}
            />
          </div>

          {/* RIGHT COLUMN: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Category + Name + Price */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--color-maroon)" }}
              >
                {product.category.replace(/-/g, " ")}
              </span>
              <h1 className="text-h1 leading-tight text-ink">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="font-display text-[1.75rem] font-semibold text-ink">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.priceStatus === "demo" ? (
                  <span className="text-xs text-muted">
                    (Demo price &ndash; subject to change)
                  </span>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <p className="text-[0.875rem] leading-relaxed text-muted">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Product Actions */}
            <ProductActions product={product} />

            {/* Style Details */}
            <StyleDetails tags={product.tags} />
          </div>
        </div>

        {/* Size Chart Modal (hidden inline, only shows modal) */}
        <SizeChart
          measurements={record.information?.measurements ?? DEFAULT_SIZE_CHART_MEASUREMENTS}
          modalOnly
        />

        {/* Related Products */}
        {related.length ? (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-h2">You may also like</h2>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
                style={{ color: "var(--color-maroon)" }}
              >
                View all
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        ) : null}
      </Container>
    </div>
  );
}
