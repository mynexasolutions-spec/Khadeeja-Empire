import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { searchProducts } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Search",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="py-12 md:py-16">
      <Container>
        <h1 className="text-h1 text-ink mb-2">Search</h1>
        {query ? (
          <p className="text-muted mb-8">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <p className="text-muted mb-8">Search for products by name, category, or tag.</p>
        )}
        <form action="/search" method="get" className="mb-8 max-w-md">
          <div className="flex items-center border-b border-border focus-within:border-ink transition-colors">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search products…"
              aria-label="Search products"
              className="flex-1 py-3 bg-transparent outline-none"
              autoFocus
            />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-ink hover:text-primary transition-colors">
              Search
            </button>
          </div>
        </form>
        {query && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-h3 text-ink mb-2">No products found</p>
            <p className="text-muted">Try a different search term or browse our shop.</p>
          </div>
        )}
        {results.length > 0 && <ProductGrid products={results} columns={4} />}
      </Container>
    </div>
  );
}
