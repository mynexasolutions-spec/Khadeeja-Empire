import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading } from "../../_components/AdminPage";
import { ProductForm } from "../../_components/ProductForm";
export default async function NewProductPage() { const categories = await getDataProvider().listCategories(); return <div><PageHeading title="New product" description="Add a product to the storefront catalog."/><AdminCard className="p-5 sm:p-6"><ProductForm categories={categories}/></AdminCard></div>; }

