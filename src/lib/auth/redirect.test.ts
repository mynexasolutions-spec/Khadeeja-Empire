import { describe, expect, it } from "vitest";
import { safeAdminRedirectPath, safeRedirectPath } from "./redirect";

describe("same-origin redirects", () => {
  it("keeps local paths and rejects external or malformed targets", () => {
    expect(safeRedirectPath("/account?tab=orders", "/")).toBe("/account?tab=orders");
    expect(safeRedirectPath("https://evil.example/account", "/")).toBe("/");
    expect(safeRedirectPath("//evil.example/account", "/")).toBe("/");
    expect(safeRedirectPath("/account\\evil", "/")).toBe("/");
    expect(safeRedirectPath(undefined, "/")).toBe("/");
  });
});

describe("admin redirects", () => {
  it("allows only admin paths", () => {
    expect(safeAdminRedirectPath("/admin", "/admin")).toBe("/admin");
    expect(safeAdminRedirectPath("/admin/orders?status=pending", "/admin")).toBe(
      "/admin/orders?status=pending"
    );
    expect(safeAdminRedirectPath("/shop", "/admin")).toBe("/admin");
    expect(safeAdminRedirectPath("/checkout", "/admin")).toBe("/admin");
    expect(safeAdminRedirectPath("//evil.example/admin", "/admin")).toBe("/admin");
    expect(safeAdminRedirectPath("https://evil.example/admin", "/admin")).toBe("/admin");
  });
});
