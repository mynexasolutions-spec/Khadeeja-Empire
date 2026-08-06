import { notFound } from "next/navigation";
import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading } from "../../../_components/AdminPage";
import { ProductForm } from "../../../_components/ProductForm";
import { ProductOptionsEditor } from "../../../_components/ProductOptionsEditor";
import { ProductInformationEditor } from "../../../_components/ProductInformationEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const provider = getDataProvider();
  const [product, categories] = await Promise.all([
    provider.getProduct(id),
    provider.listCategories(),
  ]);

  if (!product) notFound();

  const info = product.information;

  return (
    <div>
      <PageHeading
        title={`Edit ${product.name}`}
        description="Update catalog, inventory, media and SEO details."
      />

      <AdminCard className="p-5 sm:p-6">
        <ProductForm product={product} categories={categories} />
      </AdminCard>

      <AdminCard className="mt-6 p-5 sm:p-6">
        <ProductOptionsEditor
          productId={product.id}
          colors={product.colors || []}
          variants={product.variants || []}
        />
      </AdminCard>

      <AdminCard className="mt-6 p-5 sm:p-6">
        <h2 className="font-semibold text-stone-900">Product information</h2>
        <p className="mt-1 text-sm text-stone-500">
          Care, fabric, fit, shipping details and size chart shown on the product page.
        </p>

        <ProductInformationEditor info={info} productId={product.id} />
      </AdminCard>
    </div>
  );
}
