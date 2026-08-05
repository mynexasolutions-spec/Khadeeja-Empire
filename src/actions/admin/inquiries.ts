"use server";

import { inquiryStatusUpdateSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const paths = ["/admin", "/admin/inquiries"];

async function updateInquiryMutation(id: string, input: unknown) {
  return adminMutation(async () => {
    const inquiryId = parseId(id);
    const value = inquiryStatusUpdateSchema.parse(inputObject(input));
    return getDataProvider().updateInquiry(inquiryId, value);
  }, paths);
}

async function deleteInquiryMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteInquiry(parseId(id)), paths));
}

export async function updateInquiryAction(formData: FormData): Promise<void> {
  await finishFormAction(updateInquiryMutation(String(formData.get("id") ?? ""), formData));
}

export async function deleteInquiryAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteInquiryMutation(String(formData.get("id") ?? "")));
}
