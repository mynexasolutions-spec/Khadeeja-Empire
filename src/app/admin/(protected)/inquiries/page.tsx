import { deleteInquiryAction, updateInquiryAction } from "@/actions/admin/inquiries";
import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading, StatusBadge, formatDate } from "../_components/AdminPage";

export const dynamic = "force-dynamic";

const inquiryStatuses = ["unread", "read", "replied"] as const;

export default async function InquiriesPage() {
  const inquiries = await getDataProvider().listInquiries();
  const unread = inquiries.filter((inquiry) => inquiry.status === "unread").length;

  return (
    <div>
      <PageHeading
        title="Inquiries"
        description={`${unread} unread customer message${unread === 1 ? "" : "s"}.`}
      />
      <ul className="space-y-4" aria-label="Customer inquiries">
        {inquiries.length === 0 ? (
          <li>
            <AdminCard className="p-5 text-center text-sm text-stone-500">
              No inquiries. Messages from the storefront contact form will appear here.
            </AdminCard>
          </li>
        ) : (
          inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <AdminCard className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-stone-900">
                      {inquiry.subject || "General inquiry"}
                    </h2>
                    <p className="mt-1 text-sm text-stone-500">
                      {inquiry.name} ·{" "}
                      <a className="hover:text-[#9c5247]" href={`mailto:${inquiry.email}`}>
                        {inquiry.email}
                      </a>{" "}
                      · {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <StatusBadge value={inquiry.status} />
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                  {inquiry.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                  {inquiryStatuses.map((status) => (
                    <form action={updateInquiryAction} key={status}>
                      <input type="hidden" name="id" value={inquiry.id} />
                      <input type="hidden" name="status" value={status} />
                      <button className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold capitalize">
                        Mark {status}
                      </button>
                    </form>
                  ))}
                  <a
                    className="rounded-md bg-[#9c5247] px-3 py-1.5 text-xs font-semibold text-white"
                    href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(
                      inquiry.subject || "Your inquiry"
                    )}`}
                  >
                    Reply
                  </a>
                  <form action={deleteInquiryAction} className="sm:ml-auto">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <button
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700"
                      aria-label={`Delete inquiry from ${inquiry.name}`}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </AdminCard>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
