// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  provider: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    updateOrderStatus: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/admin/schemas", async () => import("../../lib/admin/schemas"));
vi.mock("@/lib/admin/errors", async () => import("../../lib/admin/errors"));
vi.mock("@/lib/auth/server", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/data", () => ({ getDataProvider: () => mocks.provider }));

import { saveCategoryAction } from "./categories";
import { updateOrderStatusAction } from "./orders";
import { saveProductAction } from "./products";

describe("admin mutation actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue({ role: "admin", email: "admin@example.com" });
    mocks.provider.createCategory.mockResolvedValue({ id: "category-new" });
    mocks.provider.updateCategory.mockResolvedValue({ id: "category-one" });
    mocks.provider.createProduct.mockResolvedValue({ id: "product-new" });
    mocks.provider.updateProduct.mockResolvedValue({ id: "product-one" });
    mocks.provider.updateOrderStatus.mockResolvedValue({ id: "order-one" });
  });

  it("authorizes, parses, and updates a category from native FormData", async () => {
    const formData = new FormData();
    formData.set("id", "category-one");
    formData.set("name", "Everyday Tops");
    formData.set("slug", "everyday-tops");
    formData.set("sortOrder", "3");

    await saveCategoryAction(formData);

    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(mocks.provider.updateCategory).toHaveBeenCalledWith("category-one", expect.objectContaining({
      name: "Everyday Tops",
      slug: "everyday-tops",
      sortOrder: 3,
      active: false,
    }));
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/categories");
  });

  it("normalizes product media, options, and SEO fields before persistence", async () => {
    const formData = new FormData();
    formData.set("name", "Linen Co-ord");
    formData.set("slug", "linen-co-ord");
    formData.set("price", "1499");
    formData.set("currency", "INR");
    formData.set("images", "/assets/images/one.jpg\n/assets/images/two.jpg");
    formData.set("sizes", "S, M, L");
    formData.set("seoTitle", "Linen Co-ord Set");
    formData.set("seoKeywords", "linen, co-ord");

    await saveProductAction(formData);

    expect(mocks.provider.createProduct).toHaveBeenCalledWith(expect.objectContaining({
      price: 1499,
      images: ["/assets/images/one.jpg", "/assets/images/two.jpg"],
      sizes: ["S", "M", "L"],
      active: false,
      featured: false,
      seo: expect.objectContaining({ title: "Linen Co-ord Set", keywords: ["linen", "co-ord"] }),
    }));
  });

  it("validates order status before invoking the provider", async () => {
    const formData = new FormData();
    formData.set("id", "order-one");
    formData.set("status", "shipped");

    await updateOrderStatusAction(formData);
    expect(mocks.provider.updateOrderStatus).toHaveBeenCalledWith("order-one", "shipped");
  });

  it("does not mutate when the admin session is absent", async () => {
    const error = new Error("Admin authentication is required.");
    error.name = "UnauthorizedError";
    mocks.requireAdmin.mockRejectedValueOnce(error);
    const formData = new FormData();
    formData.set("name", "Blocked");
    formData.set("slug", "blocked");

    await expect(saveCategoryAction(formData)).rejects.toThrow("Admin authentication is required.");
    expect(mocks.provider.createCategory).not.toHaveBeenCalled();
    expect(mocks.provider.updateCategory).not.toHaveBeenCalled();
  });
});
