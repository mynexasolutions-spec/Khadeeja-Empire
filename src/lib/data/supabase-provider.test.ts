import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DataProviderError, NotFoundError } from "../admin/errors";

vi.mock("server-only", () => ({}));

import { SupabaseDataProvider } from "./supabase-provider";

describe("Supabase provider errors", () => {
  it("surfaces configured query failures instead of switching providers", async () => {
    const builder = {
      select: () => builder,
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve(resolve({ data: null, error: { code: "42P01" } })),
    };
    const client = {
      from: () => builder,
    } as unknown as SupabaseClient;

    const provider = new SupabaseDataProvider(client);

    await expect(provider.listCategories()).rejects.toBeInstanceOf(DataProviderError);
    await expect(provider.listCategories()).rejects.toMatchObject({ code: "query" });
  });

  it("normalizes missing Supabase updates and deletes to NotFoundError", async () => {
    const builder = {
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      select: () => builder,
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve(resolve({ data: [], error: null })),
    };
    const client = {
      from: () => builder,
    } as unknown as SupabaseClient;
    const provider = new SupabaseDataProvider(client);

    await expect(provider.updateCategory("missing", { name: "Missing" })).rejects.toBeInstanceOf(
      NotFoundError
    );
    await expect(provider.deleteCategory("missing")).rejects.toBeInstanceOf(NotFoundError);
  });
});
