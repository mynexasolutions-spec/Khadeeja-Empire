"use server";

import { orderStatusUpdateSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const paths = ["/admin", "/admin/orders"];

async function updateOrderStatusMutation(id: string, input: unknown) {
  return adminMutation(async () => {
    const orderId = parseId(id);
    const { status } = orderStatusUpdateSchema.parse(inputObject(input));
    return getDataProvider().updateOrderStatus(orderId, status);
  }, [...paths, `/admin/orders/${id}`]);
}

async function deleteOrderMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteOrder(parseId(id)), paths));
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await finishFormAction(updateOrderStatusMutation(String(formData.get("id") ?? ""), formData));
}

export async function deleteOrderAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteOrderMutation(String(formData.get("id") ?? "")));
}
