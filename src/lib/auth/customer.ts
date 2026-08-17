import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDataProvider } from "@/lib/data";
import type { CustomerRecord } from "@/lib/admin/types";

export async function getCurrentCustomer(): Promise<CustomerRecord | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const provider = getDataProvider();
  const customers = await provider.listCustomers({ search: user.email });
  return customers.find((c) => c.email === user.email) ?? null;
}
