import { describe, expect, it } from "vitest";
import {
  getProviderSelection,
  requireSupabaseConfig,
} from "./config";
import { ConfigurationError } from "../admin/errors";

describe("provider selection", () => {
  it("uses local mode when Supabase is not configured", () => {
    expect(
      getProviderSelection({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      })
    ).toEqual({ mode: "local" });
  });

  it("uses Supabase mode only when every required value is configured", () => {
    const selection = getProviderSelection({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      });

    expect(selection).toEqual({
      mode: "supabase",
      url: "https://project.supabase.co",
      anonKey: "anon-key",
    });
    expect("serviceRoleKey" in selection).toBe(false);
  });

  it("treats obvious placeholder values as local mode", () => {
    expect(
      getProviderSelection({
        NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key",
      })
    ).toEqual({ mode: "local" });
  });

  it("rejects partial Supabase configuration without falling back", () => {
    expect(() =>
      getProviderSelection({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      })
    ).toThrow(ConfigurationError);

    expect(() =>
      requireSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      })
    ).toThrow(ConfigurationError);
  });
});
