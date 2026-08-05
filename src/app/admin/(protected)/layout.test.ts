import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../../../lib/auth/errors";

const { requireAdminMock, redirectMock } = vi.hoisted(() => ({
  requireAdminMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("../../../lib/auth/server", () => ({ requireAdmin: requireAdminMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import ProtectedAdminLayout from "./layout";

describe("protected admin layout", () => {
  it("redirects unauthorized server renders to admin login", async () => {
    requireAdminMock.mockRejectedValueOnce(new UnauthorizedError());
    redirectMock.mockImplementationOnce(() => {
      throw new Error("REDIRECT:/admin/login");
    });

    await expect(
      ProtectedAdminLayout({ children: "dashboard" })
    ).rejects.toThrow("REDIRECT:/admin/login");
  });

  it("renders children after server-side admin validation", async () => {
    requireAdminMock.mockResolvedValueOnce({ role: "admin" });

    const result = await ProtectedAdminLayout({ children: "dashboard" });
    expect(result).toMatchObject({ props: { children: "dashboard" } });
  });
});
