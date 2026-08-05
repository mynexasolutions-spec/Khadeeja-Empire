"use server";

import { categoryMutationSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const options = {
  booleans: ["active"],
  numbers: ["sortOrder"],
  nullable: ["description", "image", "parentId"],
};

const paths = ["/admin/categories", "/", "/shop"];

async function saveCategoryMutation(input: unknown, id?: string) {
  return adminMutation(async () => {
    const raw = inputObject(input, options) as Record<string, unknown>;
    const recordId = id ?? (typeof raw?.id === "string" && raw.id ? raw.id : undefined);
    const value = categoryMutationSchema.parse(raw);
    const provider = getDataProvider();
    return recordId ? provider.updateCategory(parseId(recordId), value) : provider.createCategory(value);
  }, paths);
}

async function deleteCategoryMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteCategory(parseId(id)), paths));
}

async function toggleCategoryMutation(id: string, active: boolean) {
  return adminMutation(
    async () => getDataProvider().setCategoryActive(parseId(id), active),
    paths
  );
}

export async function saveCategoryAction(formData: FormData): Promise<void> {
  if (!formData.has("active")) formData.set("active", "false");
  await finishFormAction(saveCategoryMutation(formData));
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteCategoryMutation(String(formData.get("id") ?? "")));
}

export async function toggleCategoryAction(formData: FormData): Promise<void> {
  await finishFormAction(toggleCategoryMutation(
    String(formData.get("id") ?? ""),
    String(formData.get("active") ?? "false") === "true"
  ));
}
