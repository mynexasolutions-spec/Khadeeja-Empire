"use server";

import { reviewMutationSchema, reviewStatusUpdateSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const paths = ["/admin", "/admin/reviews", "/"];

async function saveReviewMutation(input: unknown, id?: string) {
  return adminMutation(async () => {
    const raw = inputObject(input, {
      booleans: ["isHomeFeatured"], numbers: ["rating"],
      nullable: ["productId", "customerId", "authorEmail", "title", "status", "isHomeFeatured"],
    }) as Record<string, unknown>;
    const recordId = id ?? (typeof raw?.id === "string" && raw.id ? raw.id : undefined);
    const value = reviewMutationSchema.parse(raw);
    const provider = getDataProvider();
    return recordId ? provider.updateReview(parseId(recordId), value) : provider.createReview(value);
  }, paths);
}

export async function saveReviewAction(formData: FormData): Promise<void> {
  if (!formData.has("isHomeFeatured")) formData.set("isHomeFeatured", "false");
  await finishFormAction(saveReviewMutation(formData));
}

async function updateReviewMutation(id: string, input: unknown) {
  return adminMutation(async () => {
    const reviewId = parseId(id);
    const value = reviewStatusUpdateSchema.parse(inputObject(input, { booleans: ["isHomeFeatured"] }));
    return getDataProvider().updateReview(reviewId, value);
  }, paths);
}

async function deleteReviewMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteReview(parseId(id)), paths));
}

export async function updateReviewAction(formData: FormData): Promise<void> {
  await finishFormAction(updateReviewMutation(String(formData.get("id") ?? ""), formData));
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteReviewMutation(String(formData.get("id") ?? "")));
}
