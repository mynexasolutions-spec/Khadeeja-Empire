import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("server-only", () => ({}));

import { SupabaseDataProvider } from "./supabase-provider";

describe("Supabase setting mutations", () => {
  it("uses database upsert for provider-backed challenge state", async () => {
    const builder = {
      upsert: vi.fn(() => builder),
      select: vi.fn(() => builder),
      single: vi.fn(() =>
        Promise.resolve({ data: { id: "setting-1", key: "auth.otp.challenge.hash", value: {} }, error: null })
      ),
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve(resolve({ data: [{ id: "setting-1" }], error: null })),
    };
    const client = { from: vi.fn(() => builder) } as unknown as SupabaseClient;
    const provider = new SupabaseDataProvider(client);

    await provider.upsertSetting("auth.otp.challenge.hash", { attempts: 1 });
    expect(builder.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ key: "auth.otp.challenge.hash", value: { attempts: 1 } }),
      { onConflict: "key" }
    );
  });

  it("deletes a setting directly so one-time consumption has one winner", async () => {
    const builder = {
      delete: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      select: vi.fn(() => builder),
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve(resolve({ data: [{ id: "setting-1" }], error: null })),
    };
    const client = { from: vi.fn(() => builder) } as unknown as SupabaseClient;
    const provider = new SupabaseDataProvider(client);

    await provider.deleteSetting("auth.otp.challenge.hash");
    expect(builder.delete).toHaveBeenCalledOnce();
    expect(builder.eq).toHaveBeenCalledWith("key", "auth.otp.challenge.hash");
  });
});
