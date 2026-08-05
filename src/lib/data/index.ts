import "server-only";

import type { DataProvider } from "./provider";
import { getProviderSelection } from "./config";
import { createLocalProvider } from "./local-provider";
import { createSupabaseProvider } from "./supabase-provider";

export function getDataProvider(): DataProvider {
  const selection = getProviderSelection();
  return selection.mode === "supabase" ? createSupabaseProvider() : createLocalProvider();
}

export const getProvider = getDataProvider;
export type { DataProvider } from "./provider";
