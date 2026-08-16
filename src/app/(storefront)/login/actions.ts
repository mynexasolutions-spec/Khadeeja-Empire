"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDataProvider } from "@/lib/data";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextUrl = (formData.get("next") as string) || "/";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const dataProvider = getDataProvider();
  const customers = await dataProvider.listCustomers({ search: email });
  const customer = customers.find(c => c.email === email);

  if (customer?.status === "inactive") {
    await supabase.auth.signOut();
    return { error: "Your account is pending admin approval." };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = (formData.get("phone") as string) || "";
  const nextUrl = (formData.get("next") as string) || "/";

  if (!email || !password || !fullName || !phone) {
    return { error: "All fields are required." };
  }

  const adminClient = createServiceRoleClient();

  const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createErr) {
    if (createErr.message?.toLowerCase().includes("already been registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: createErr.message };
  }
  if (!created?.user) {
    return { error: "Could not create account. Please try again." };
  }

  const dataProvider = getDataProvider();
  try {
    await dataProvider.createCustomer({
      name: fullName,
      email: email,
      phone: phone,
      status: "active",
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create customer profile." };
  }

  const supabase = await createClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signInErr) {
    return { success: "Account created! You can now log in." };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent to your email." };
}
