"use server";

import { createClient } from "@/lib/supabase/server";
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
  const nextUrl = (formData.get("next") as string) || "/";

  if (!email || !password || !fullName) {
    return { error: "All fields are required." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  
  if (data?.user?.identities?.length === 0) {
    return { error: "An account with this email already exists." };
  }

  const dataProvider = getDataProvider();
  await dataProvider.createCustomer({
    name: fullName,
    email: email,
    status: "inactive",
  });

  await supabase.auth.signOut();
  return { success: "Account created! Please wait for admin approval." };
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
