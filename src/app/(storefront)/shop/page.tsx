import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { getDataProvider } from "@/lib/data";
import { toStorefrontCategory, toStorefrontProduct } from "@/lib/storefront/adapters";
export const metadata: Metadata = { title: "Shop All", description: "Browse our full collection of elegant Indian womenswear." };
export const dynamic = "force-dynamic";
export default async function ShopPage() { const provider=getDataProvider(); const [records,categories]=await Promise.all([provider.listProducts({active:true}),provider.listCategories({active:true})]); const products=records.map(toStorefrontProduct); return <div className="py-12 md:py-16"><Container><div className="mb-10 flex flex-col gap-2"><h1 className="text-h1 text-ink">Shop All</h1><p className="text-muted">{products.length} products</p></div><div className="mb-8 flex flex-wrap gap-2">{categories.map(toStorefrontCategory).map(cat=><Link key={cat.slug} href={`/collections/${cat.slug}`} className="border border-border px-4 py-2 text-sm transition-colors hover:border-ink">{cat.name}</Link>)}</div>{products.length?<ProductGrid products={products} columns={4} priorityCount={4}/>:<div className="py-16 text-center"><p className="text-h3 text-ink">The collection is being prepared</p><p className="mt-2 text-muted">Please check back soon.</p></div>}</Container></div>; }
