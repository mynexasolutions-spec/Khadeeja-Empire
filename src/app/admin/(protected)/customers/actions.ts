"use server";

import { getDataProvider } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function approveCustomer(id: string) {
  const dataProvider = getDataProvider();
  await dataProvider.updateCustomer(id, { status: "active" });
  revalidatePath("/admin/(protected)/customers", "page");
}
