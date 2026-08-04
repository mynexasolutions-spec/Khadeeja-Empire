import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { products } from "@/content/catalog";
import { categories } from "@/content/categories";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse our full collection of elegant Indian womenswear.",
};

export default function ShopPage() {
  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-h1 text-ink">Shop All</h1>
          <p className="text-muted">{products.length} products</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="px-4 py-2 text-sm border border-border hover:border-ink transition-colors"
            >
              {cat.name}
            </a>
          ))}
        </div>
        <ProductGrid products={products} columns={4} priorityCount={4} />
      </Container>
    </div>
  );
}
