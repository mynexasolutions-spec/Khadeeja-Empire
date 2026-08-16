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

  it("assigns an incrementing sort_order to product images on create, in upload order", async () => {
    let nextImageId = 1;
    const productImageRows: Record<string, unknown>[] = [];
    const productRow = { id: "product-1", slug: "linen-set", name: "Linen Set" };

    const client = {
      from: (table: string) => {
        if (table === "products") {
          return {
            insert: () => ({
              select: () => ({ single: () => Promise.resolve({ data: productRow, error: null }) }),
            }),
            select: () => ({
              eq: () => ({ maybeSingle: () => Promise.resolve({ data: productRow, error: null }) }),
            }),
          };
        }
        if (table === "product_images") {
          return {
            insert: (payload: Record<string, unknown>) => ({
              select: () => ({
                single: () => {
                  const row = { id: `image-${nextImageId++}`, ...payload };
                  productImageRows.push(row);
                  return Promise.resolve({ data: row, error: null });
                },
              }),
            }),
            select: () => Promise.resolve({ data: productImageRows, error: null }),
          };
        }
        // product_colors, product_variants, product_information: nothing hydrated for this product yet.
        return {
          select: () => Promise.resolve({ data: [], error: null }),
        };
      },
    } as unknown as SupabaseClient;

    const provider = new SupabaseDataProvider(client);
    await provider.createProduct({
      name: "Linen Set",
      slug: "linen-set",
      images: ["https://cdn.example.com/first.jpg", "https://cdn.example.com/second.jpg", "https://cdn.example.com/third.jpg"],
    } as never);

    expect(productImageRows.map((row) => row.sort_order)).toEqual([0, 1, 2]);
    expect(productImageRows.map((row) => row.url)).toEqual([
      "https://cdn.example.com/first.jpg",
      "https://cdn.example.com/second.jpg",
      "https://cdn.example.com/third.jpg",
    ]);
  });
});
