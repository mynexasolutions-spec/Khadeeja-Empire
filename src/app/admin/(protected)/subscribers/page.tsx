import { deleteSubscriberAction, saveSubscriberAction } from "@/actions/admin/subscribers";
import { getDataProvider } from "@/lib/data";
import {
  AdminCard,
  PageHeading,
  formatDate,
  tableCell,
  tableHead,
} from "../_components/AdminPage";

export const dynamic = "force-dynamic";

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const records = await getDataProvider().listSubscribers({ search: q });

  return (
    <div>
      <PageHeading
        title="Subscribers"
        description="Manage newsletter subscribers and contact preferences."
      />
      <AdminCard className="mb-6 p-5">
        <form action={saveSubscriberAction} className="flex flex-col gap-3 sm:flex-row">
          <input
            className="min-h-10 flex-1 rounded-lg border border-stone-300 px-3 text-sm"
            name="email"
            type="email"
            required
            placeholder="Email address"
          />
          <input
            className="min-h-10 flex-1 rounded-lg border border-stone-300 px-3 text-sm"
            name="name"
            placeholder="Name (optional)"
          />
          <input type="hidden" name="source" value="admin" />
          <button className="rounded-lg bg-[#9c5247] px-4 text-sm font-semibold text-white">
            Add subscriber
          </button>
        </form>
      </AdminCard>
      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Newsletter subscribers">
            <thead className="bg-stone-50">
              <tr>
                <th className={tableHead}>Email</th>
                <th className={tableHead}>Name</th>
                <th className={tableHead}>Source</th>
                <th className={tableHead}>Subscribed</th>
                <th className={tableHead}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.length === 0 ? (
                <tr>
                  <td className={`${tableCell} text-center`} colSpan={5}>
                    No subscribers found. Newsletter signups will appear here.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className={tableCell}>
                      <a
                        className="font-semibold text-stone-900 hover:text-[#9c5247]"
                        href={`mailto:${record.email}`}
                      >
                        {record.email}
                      </a>
                    </td>
                    <td className={tableCell}>{record.name || "—"}</td>
                    <td className={tableCell}>{record.source || "storefront"}</td>
                    <td className={tableCell}>{formatDate(record.subscribedAt)}</td>
                    <td className={tableCell}>
                      <form action={deleteSubscriberAction}>
                        <input type="hidden" name="id" value={record.id} />
                        <button
                          className="text-xs font-semibold text-red-700"
                          aria-label={`Delete subscriber ${record.email}`}
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
