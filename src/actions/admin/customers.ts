"use server";

import { customerMutationSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, parseId } from "./common";

const paths = ["/admin", "/admin/customers"];

async function saveCustomerMutation(input: unknown, id?: string) {
  return adminMutation(async () => {
    const raw = inputObject(input, { nullable: ["name", "email", "phone", "status"] }) as Record<string, unknown>;
    const recordId = id ?? (typeof raw?.id === "string" && raw.id ? raw.id : undefined);
    const value = customerMutationSchema.parse(raw);
    const provider = getDataProvider();
    return recordId ? provider.updateCustomer(parseId(recordId), value) : provider.createCustomer(value);
  }, paths);
}

async function toggleCustomerMutation(id: string, active: boolean) {
  return adminMutation(async () => {
    const customerId = parseId(id);
    const provider = getDataProvider();
    const customer = await provider.getCustomer(customerId);
    if (!customer) throw new Error("Customer was not found.");
    return provider.updateCustomer(customerId, {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: active ? "active" : "inactive",
    });
  }, paths);
}

export async function saveCustomerAction(formData: FormData): Promise<void> {
  await finishFormAction(saveCustomerMutation(formData));
}

export async function toggleCustomerAction(formData: FormData): Promise<void> {
  await finishFormAction(toggleCustomerMutation(
    String(formData.get("id") ?? ""),
    String(formData.get("active") ?? "false") === "true"
  ));
}
