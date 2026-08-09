import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { getDataProvider } from "@/lib/data";
import {
  toStorefrontCategory,
  toStorefrontProduct,
} from "@/lib/storefront/adapters";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse our full collection of elegant Indian womenswear.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const provider = getDataProvider();
  const [productRecords, categoryRecords] = await Promise.all([
    provider.listProducts({ active: true }),
    provider.listCategories({ active: true }),
  ]);

  const products = productRecords.map(toStorefrontProduct);
  const categories = categoryRecords.map(toStorefrontCategory);

  return (
    <div className="py-8 md:py-12">
      <Container className="max-w-[1460px]">
        <ShopCatalog products={products} categories={categories} />
      </Container>
    </div>
  );
}
