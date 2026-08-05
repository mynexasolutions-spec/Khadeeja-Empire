import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading } from "../../_components/AdminPage";
import { CategoryForm } from "../../_components/CategoryForm";

export default async function NewCategoryPage() {
  const categories = await getDataProvider().listCategories();
  return <div><PageHeading title="New category" description="Add a category to the storefront catalog." /><AdminCard className="p-5 sm:p-6"><CategoryForm categories={categories} /></AdminCard></div>;
}

