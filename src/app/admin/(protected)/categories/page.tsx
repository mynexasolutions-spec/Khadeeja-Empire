import Link from "next/link";
import { getDataProvider } from "@/lib/data";
import { deleteCategoryAction, toggleCategoryAction } from "@/actions/admin/categories";
import { AdminCard, EmptyState, PageHeading, StatusBadge, tableCell, tableHead } from "../_components/AdminPage";
import { DiscoveryMenuEditor } from "../_components/DiscoveryMenuEditor";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const provider = getDataProvider();
  const [categories, discovery] = await Promise.all([provider.listCategories(), provider.listDiscoveryMenuEntries()]);
  return <div>
    <PageHeading title="Categories" description="Organise products and control collection discovery." action={{ href: "/admin/categories/new", label: "Add category" }} />
    <AdminCard>
      {categories.length === 0 ? <EmptyState title="No categories" detail="Create your first category to organise the catalog." /> : <div className="overflow-x-auto"><table className="w-full"><thead className="bg-stone-50"><tr><th className={tableHead}>Category</th><th className={tableHead}>Products</th><th className={tableHead}>Status</th><th className={tableHead}>Actions</th></tr></thead><tbody className="divide-y divide-stone-100">
        {categories.map((category) => <tr key={category.id} className="hover:bg-stone-50/70"><td className={tableCell}><p className="font-semibold text-stone-900">{category.name}</p><p className="text-xs text-stone-400">/{category.slug}</p></td><td className={tableCell}>{category.productCount ?? 0}</td><td className={tableCell}><StatusBadge value={category.active !== false} /></td><td className={`${tableCell} whitespace-nowrap`}><div className="flex gap-2"><Link href={`/admin/categories/${category.id}/edit`} className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold">Edit</Link><form action={toggleCategoryAction}><input type="hidden" name="id" value={category.id}/><input type="hidden" name="active" value={String(category.active === false)}/><button className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold">{category.active === false ? "Activate" : "Disable"}</button></form><form action={deleteCategoryAction}><input type="hidden" name="id" value={category.id}/><button className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button></form></div></td></tr>)}
      </tbody></table></div>}
    </AdminCard>
    <AdminCard className="mt-6 p-5"><DiscoveryMenuEditor entries={discovery} categories={categories}/></AdminCard>
  </div>;
}
