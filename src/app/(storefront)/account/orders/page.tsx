import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDataProvider } from "@/lib/data";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { formatPrice } from "@/lib/utils";
import { logout } from "../../login/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Orders",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-stone-100 text-stone-600 border-stone-200",
};

function formatOrderDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function AccountOrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login?next=/account/orders");
  }

  const provider = getDataProvider();
  const orders = (await provider.listOrders())
    .filter((order) => order.customerId === customer.id)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-h1 text-ink">My Orders</h1>
            <p className="mt-2 text-sm text-muted">
              {customer.name ? `Welcome back, ${customer.name}.` : "Your order history."}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="h-10 px-5 border border-[var(--color-border-strong)] text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] hover:border-[var(--color-maroon)] hover:text-[var(--color-maroon)] transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 border border-border py-20 text-center">
            <Package size={32} strokeWidth={1.5} className="text-muted" />
            <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/shop"
              className="h-11 px-6 inline-flex items-center justify-center bg-[#2d2520] hover:bg-primary !text-white font-semibold tracking-widest text-xs uppercase transition-colors"
              style={{ color: '#ffffff' }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">#{order.orderNumber}</p>
                    <p className="text-xs text-muted mt-0.5">{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wide border rounded-full ${STATUS_STYLES[order.status] ?? "bg-stone-100 text-stone-600 border-stone-200"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <ul className="flex flex-col gap-2 py-4">
                  {(order.items ?? []).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ink">
                        {item.productName}
                        {item.size ? ` (${item.size})` : ""} &times; {item.quantity}
                      </span>
                      <span className="text-muted shrink-0">{formatPrice(item.totalPrice, order.currency ?? "INR")}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-wide text-muted">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod ?? ""}
                  </span>
                  <span className="font-semibold text-ink">{formatPrice(order.total, order.currency ?? "INR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
