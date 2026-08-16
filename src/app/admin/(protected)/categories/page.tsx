import Link from "next/link";
import { getDataProvider } from "@/lib/data";
import { AdminCard, EmptyState, PageHeading, StatusBadge, tableCell, tableHead } from "../_components/AdminPage";
import { DiscoveryMenuEditor } from "../_components/DiscoveryMenuEditor";
import { CategoryRowActions } from "../_components/CategoryRowActions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const provider = getDataProvider();
  const [categories, discovery] = await Promise.all([provider.listCategories(), provider.listDiscoveryMenuEntries()]);
  return <div>
    <PageHeading title="Categories" description="Organise products and control collection discovery." action={{ href: "/admin/categories/new", label: "Add category" }} />
    <AdminCard>
      {categories.length === 0 ? <EmptyState title="No categories" detail="Create your first category to organise the catalog." /> : <div className="overflow-x-auto"><table className="w-full"><thead className="bg-stone-50"><tr><th className={tableHead}>Category</th><th className={tableHead}>Products</th><th className={tableHead}>Status</th><th className={tableHead}>Actions</th></tr></thead><tbody className="divide-y divide-stone-100">
        {categories.map((category) => <tr key={category.id} className="hover:bg-stone-50/70"><td className={tableCell}><p className="font-semibold text-stone-900">{category.name}</p><p className="text-xs text-stone-400">/{category.slug}</p></td><td className={tableCell}>{category.productCount ?? 0}</td><td className={tableCell}><StatusBadge value={category.active !== false} /></td><td className={`${tableCell} whitespace-nowrap`}><CategoryRowActions id={category.id} name={category.name} active={category.active !== false}/></td></tr>)}
      </tbody></table></div>}
    </AdminCard>
    <AdminCard className="mt-6 p-5"><DiscoveryMenuEditor entries={discovery} categories={categories}/></AdminCard>
  </div>;
}
