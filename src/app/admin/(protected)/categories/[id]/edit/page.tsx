import { notFound } from "next/navigation";
import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading } from "../../../_components/AdminPage";
import { CategoryForm } from "../../../_components/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = getDataProvider();
  const [category, categories] = await Promise.all([provider.getCategory(id), provider.listCategories()]);
  if (!category) notFound();
  return <div><PageHeading title={`Edit ${category.name}`} description="Update category details and storefront visibility." /><AdminCard className="p-5 sm:p-6"><CategoryForm category={category} categories={categories} /></AdminCard></div>;
}
