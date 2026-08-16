import { deleteInquiryAction, updateInquiryAction } from "@/actions/admin/inquiries";
import { getDataProvider } from "@/lib/data";
import { AdminCard, PageHeading, StatusBadge, formatDate } from "../_components/AdminPage";
import { Mail, MessageSquare, Trash2, CheckCircle, ExternalLink, Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";

const inquiryStatuses = [
  { value: "unread", label: "Unread", color: "border-amber-200 text-amber-700 hover:bg-amber-50" },
  { value: "read", label: "Read", color: "border-stone-300 text-stone-600 hover:bg-stone-50" },
  { value: "replied", label: "Replied", color: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" }
] as const;

export default async function InquiriesPage() {
  const inquiries = await getDataProvider().listInquiries();
  const unread = inquiries.filter((inquiry) => inquiry.status === "unread").length;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Customer Inquiries"
        description={`${unread} unread customer message${unread === 1 ? "" : "s"}.`}
      />

      <div className="grid gap-6">
        {inquiries.length === 0 ? (
          <AdminCard className="flex flex-col items-center justify-center p-12 text-center bg-stone-50/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">No inquiries</h3>
            <p className="mt-1 text-xs text-stone-500 max-w-sm">
              Messages from the storefront contact form will appear here. Currently your inbox is empty.
            </p>
          </AdminCard>
        ) : (
          inquiries.map((inquiry) => {
            const isUnread = inquiry.status === "unread";
            return (
              <AdminCard 
                key={inquiry.id} 
                className={`transition-all duration-200 hover:shadow-md border-l-4 ${
                  isUnread ? "border-l-amber-500" : "border-l-stone-200"
                }`}
              >
                <div className="p-6">
                  {/* Top segment */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                          {inquiry.subject || "General Inquiry"}
                        </span>
                        <StatusBadge value={inquiry.status} />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-stone-400" />
                          <span className="font-semibold text-stone-700">{inquiry.name}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-stone-400" />
                          <a className="text-[#9c5247] hover:underline" href={`mailto:${inquiry.email}`}>
                            {inquiry.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="bg-stone-50/50 rounded-lg p-4 border border-stone-100">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700 font-normal">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Action Segment */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {inquiryStatuses.map((status) => {
                        const isCurrent = inquiry.status === status.value;
                        return (
                          <form action={updateInquiryAction} key={status.value}>
                            <input type="hidden" name="id" value={inquiry.id} />
                            <input type="hidden" name="status" value={status.value} />
                            <button 
                              disabled={isCurrent}
                              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${status.color} ${
                                isCurrent ? "bg-stone-50 opacity-50 cursor-not-allowed border-stone-200" : ""
                              }`}
                            >
                              {status.value === "replied" && <CheckCircle className="h-3.5 w-3.5" />}
                              Mark {status.label}
                            </button>
                          </form>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#9c5247] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#7e3f35] transition"
                        href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(
                          inquiry.subject || "Your inquiry"
                        )}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Reply by Mail
                      </a>
                      
                      <form action={deleteInquiryAction}>
                        <input type="hidden" name="id" value={inquiry.id} />
                        <button
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                          aria-label={`Delete inquiry from ${inquiry.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </AdminCard>
            );
          })
        )}
      </div>
    </div>
  );
}
