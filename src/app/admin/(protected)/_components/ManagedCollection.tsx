import type { ComponentProps } from "react";
import { AdminCard, EmptyState, StatusBadge } from "./AdminPage";

export type ServerFormAction = NonNullable<ComponentProps<"form">["action"]>;

export type ManagedField = {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "number" | "textarea" | "checkbox" | "select" | "datetime-local";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  min?: number;
  step?: number;
};

function fieldValue(record: Record<string, unknown> | undefined, name: string) {
  const value = record?.[name];
  if (Array.isArray(value)) return value.join(", ");
  return value == null ? "" : String(value);
}

function Editor({ fields, record }: { fields: ManagedField[]; record?: Record<string, unknown> }) {
  return <div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => {
    const id = `${record?.id || "new"}-${field.name}`;
    const inputClass = "mt-1 min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#9c5247] focus:ring-2 focus:ring-[#9c5247]/20";
    if (field.type === "checkbox") return <label key={field.name} className="mt-6 flex min-h-10 items-center gap-2 text-sm font-medium text-stone-700"><input id={id} name={field.name} type="checkbox" defaultChecked={record ? Boolean(record[field.name]) : true} className="h-4 w-4 accent-[#9c5247]"/>{field.label}</label>;
    return <label key={field.name} htmlFor={id} className={`text-sm font-medium text-stone-700 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>{field.label}{field.type === "textarea" ? <textarea id={id} name={field.name} required={field.required} placeholder={field.placeholder} defaultValue={fieldValue(record, field.name)} className={`${inputClass} min-h-24 py-2.5`}/> : field.type === "select" ? <select id={id} name={field.name} required={field.required} defaultValue={fieldValue(record, field.name)} className={inputClass}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input id={id} name={field.name} type={field.type || "text"} required={field.required} placeholder={field.placeholder} min={field.min} step={field.step} defaultValue={fieldValue(record, field.name)} className={inputClass}/>}</label>;
  })}</div>;
}

export function ManagedCollection({
  records,
  fields,
  saveAction,
  deleteAction,
  emptyTitle,
  createLabel = "Add item",
  summary,
}: {
  records: Array<Record<string, unknown>>;
  fields: ManagedField[];
  saveAction: ServerFormAction;
  deleteAction: ServerFormAction;
  emptyTitle: string;
  createLabel?: string;
  summary: (record: Record<string, unknown>) => { title: string; detail?: string; status?: string | boolean | null };
}) {
  return <div className="space-y-6"><AdminCard className="p-5 sm:p-6"><h2 className="mb-4 font-semibold text-stone-900">{createLabel}</h2><form action={saveAction}><Editor fields={fields}/><div className="mt-4 flex justify-end"><button className="min-h-10 rounded-lg bg-[#9c5247] px-4 text-sm font-semibold text-white hover:bg-[#7e3f35]">Save</button></div></form></AdminCard>
    {records.length === 0 ? <AdminCard><EmptyState title={emptyTitle}/></AdminCard> : records.map((record) => { const info = summary(record); return <AdminCard key={String(record.id)}><div className="flex flex-col gap-3 border-b border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-stone-900">{info.title}</h3>{info.detail ? <p className="mt-0.5 text-sm text-stone-500">{info.detail}</p> : null}</div>{info.status != null ? <StatusBadge value={info.status}/> : null}</div><form action={saveAction} className="p-5"><input type="hidden" name="id" value={String(record.id)}/><Editor fields={fields} record={record}/><div className="mt-4 flex justify-end gap-2"><button className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700">Save changes</button></div></form><form action={deleteAction} className="border-t border-stone-100 px-5 py-3 text-right"><input type="hidden" name="id" value={String(record.id)}/><button className="text-sm font-semibold text-red-700 hover:underline">Delete</button></form></AdminCard>; })}
  </div>;
}
