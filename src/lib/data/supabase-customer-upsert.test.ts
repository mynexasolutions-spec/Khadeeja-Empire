import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("server-only", () => ({}));

import { SupabaseDataProvider } from "./supabase-provider";

describe("Supabase customer phone upsert", () => {
  it("uses the database unique phone conflict target", async () => {
    const result = { data: { id: "customer-1", phone: "+919876543210", status: "active" }, error: null };
    const builder = {
      upsert: vi.fn(() => builder),
      select: vi.fn(() => builder),
      single: vi.fn(() => Promise.resolve(result)),
    };
    const client = { from: vi.fn(() => builder) } as unknown as SupabaseClient;
    const provider = new SupabaseDataProvider(client);

    await expect(
      provider.upsertCustomerByPhone("+919876543210", { status: "active" })
    ).resolves.toMatchObject({ id: "customer-1", phone: "+919876543210" });
    expect(builder.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "+919876543210", status: "active" }),
      { onConflict: "phone" }
    );
  });
});
