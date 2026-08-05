import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#9c5247] px-4 text-sm font-semibold text-white transition hover:bg-[#7e3f35]"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-xl border border-stone-200 bg-white ${className}`}>
      {children}
    </section>
  );
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-medium text-stone-700">{title}</p>
      {detail ? <p className="mt-1 text-sm text-stone-400">{detail}</p> : null}
    </div>
  );
}

export function StatusBadge({ value }: { value: string | boolean | null | undefined }) {
  const label = typeof value === "boolean" ? (value ? "Active" : "Inactive") : value || "Unknown";
  const positive = value === true || ["active", "approved", "paid", "delivered", "replied"].includes(String(value));
  const negative = value === false || ["inactive", "rejected", "failed", "cancelled", "refunded"].includes(String(value));
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : negative
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {label}
    </span>
  );
}

export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

export const tableHead = "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500";
export const tableCell = "px-5 py-3.5 text-sm text-stone-700";

