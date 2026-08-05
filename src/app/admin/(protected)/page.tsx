import Link from "next/link";
import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { getDataProvider } from "@/lib/data";
import {
  AdminCard,
  EmptyState,
  PageHeading,
  StatusBadge,
  formatCurrency,
  formatDate,
  tableCell,
  tableHead,
} from "./_components/AdminPage";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getDataProvider().getDashboardMetrics();
  const cards = [
    { label: "Total Revenue", value: formatCurrency(metrics.totalRevenue), Icon: IndianRupee, color: "bg-orange-500" },
    { label: "Total Orders", value: String(metrics.totalOrders), Icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Customers", value: String(metrics.totalCustomers), Icon: Users, color: "bg-emerald-600" },
    { label: "Products", value: String(metrics.totalProducts), Icon: Package, color: "bg-violet-600" },
  ];

  return (
    <div>
      <PageHeading title="Overview" description="Welcome back. Here’s what’s happening with your store." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon, color }) => (
          <AdminCard key={label} className="p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm ${color}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{value}</p>
            <p className="mt-1 text-sm text-stone-500">{label}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard>
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-[#9c5247] hover:underline">View all</Link>
        </div>
        {metrics.recentOrders.length === 0 ? (
          <EmptyState title="No orders yet" detail="Orders will appear here after checkout." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr><th className={tableHead}>Order</th><th className={tableHead}>Amount</th><th className={tableHead}>Status</th><th className={tableHead}>Payment</th><th className={tableHead}>Date</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70">
                    <td className={tableCell}><Link href={`/admin/orders/${order.id}`} className="font-semibold text-stone-900 hover:text-[#9c5247]">#{order.orderNumber}</Link></td>
                    <td className={tableCell}>{formatCurrency(order.total, order.currency || "INR")}</td>
                    <td className={tableCell}><StatusBadge value={order.status} /></td>
                    <td className={tableCell}><StatusBadge value={order.paymentStatus} /></td>
                    <td className={tableCell}>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

