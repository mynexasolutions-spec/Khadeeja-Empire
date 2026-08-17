"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDataProvider } from "@/lib/data";
import { reviewMutationSchema } from "@/lib/admin/schemas";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Please log in to write a review." };
  }

  const productId = String(formData.get("productId") || "");
  const productSlug = String(formData.get("productSlug") || "");
  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!productId) {
    return { error: "Missing product." };
  }

  const dataProvider = getDataProvider();
  const customers = await dataProvider.listCustomers({ search: user.email });
  const customer = customers.find((c) => c.email === user.email);

  const fullName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) || "";
  const authorName = customer?.name || fullName || user.email.split("@")[0];

  const parsed = reviewMutationSchema.safeParse({
    productId,
    customerId: customer?.id ?? null,
    authorName,
    authorEmail: user.email,
    rating,
    title: title || null,
    body,
    status: "pending",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check your review and try again." };
  }

  try {
    await dataProvider.createReview(parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not submit review." };
  }

  if (productSlug) revalidatePath(`/products/${productSlug}`);
  return { success: "Thanks! Your review has been submitted and will appear once approved." };
}
