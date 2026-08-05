import { ConfigurationError } from "../admin/errors";

export interface SupabaseProviderConfig {
  mode: "supabase";
  url: string;
  anonKey: string;
}

export interface LocalProviderConfig {
  mode: "local";
}

export type ProviderSelection = SupabaseProviderConfig | LocalProviderConfig;

const SUPABASE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const PLACEHOLDER_PATTERNS = [
  /^your[-_]/i,
  /^replace[-_]?me$/i,
  /^change[-_]?me$/i,
  /^example$/i,
  /^xxx+$/i,
  /your-project/i,
  /your[-_](anon|service)/i,
  /<[^>]+>/,
  /^\$\{[^}]+\}$/,
];

export function isPlaceholderValue(value: string | undefined): boolean {
  const normalized = value?.trim();
  if (!normalized) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
}

function getPublicValues(env: Record<string, string | undefined>) {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}

function hasUsableServiceRoleKey(env: Record<string, string | undefined>): boolean {
  return !isPlaceholderValue(env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getProviderSelection(
  env: Record<string, string | undefined> = process.env
): ProviderSelection {
  const values = getPublicValues(env);
  const configured =
    !isPlaceholderValue(values.url) &&
    !isPlaceholderValue(values.anonKey) &&
    hasUsableServiceRoleKey(env);
  const hasMeaningfulValue =
    !isPlaceholderValue(values.url) ||
    !isPlaceholderValue(values.anonKey) ||
    hasUsableServiceRoleKey(env);

  if (hasMeaningfulValue && !configured) {
    throw new ConfigurationError(
      `Supabase configuration requires all of: ${SUPABASE_KEYS.join(", ")}.`
    );
  }

  if (!configured) return { mode: "local" };

  return {
    mode: "supabase",
    url: values.url,
    anonKey: values.anonKey,
  };
}

export function requireSupabaseConfig(
  env: Record<string, string | undefined> = process.env
): SupabaseProviderConfig {
  const selection = getProviderSelection(env);
  if (selection.mode !== "supabase") {
    throw new ConfigurationError(
      "Supabase is not configured. Set all required Supabase variables before using this client."
    );
  }
  return selection;
}

export function isSupabaseConfigured(
  env: Record<string, string | undefined> = process.env
): boolean {
  return getProviderSelection(env).mode === "supabase";
}

export const getProviderMode = getProviderSelection;
