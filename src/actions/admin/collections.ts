"use server";

import { collectionMutationSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const paths = ["/admin/categories", "/", "/shop"];

async function saveCollectionMutation(input: unknown, id?: string) {
  return adminMutation(async () => {
    const raw = inputObject(input, {
      booleans: ["active"], numbers: ["sortOrder"],
      nullable: ["description", "image", "parentId", "heroCopy", "active", "sortOrder"],
    }) as Record<string, unknown>;
    const collectionId = id ?? (typeof raw?.id === "string" && raw.id ? raw.id : undefined);
    const value = collectionMutationSchema.parse(raw);
    const provider = getDataProvider();
    return collectionId ? provider.updateCollection(parseId(collectionId), value) : provider.createCollection(value);
  }, paths);
}

async function deleteCollectionMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteCollection(parseId(id)), paths));
}

export async function saveCollectionAction(formData: FormData): Promise<void> {
  if (!formData.has("active")) formData.set("active", "false");
  await finishFormAction(saveCollectionMutation(formData));
}

export async function deleteCollectionAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteCollectionMutation(String(formData.get("id") ?? "")));
}
