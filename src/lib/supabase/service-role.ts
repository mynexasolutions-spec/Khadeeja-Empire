import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ConfigurationError } from "@/lib/admin/errors";
import { isPlaceholderValue, requireSupabaseConfig } from "@/lib/data/config";

function requireServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRoleKey || isPlaceholderValue(serviceRoleKey)) {
    throw new ConfigurationError("Supabase service-role configuration is missing.");
  }
  return serviceRoleKey;
}

export function createSupabaseServiceRoleClient(): SupabaseClient {
  const config = requireSupabaseConfig();
  const serviceRoleKey = requireServiceRoleKey();

  return createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export const createServiceRoleClient = createSupabaseServiceRoleClient;
