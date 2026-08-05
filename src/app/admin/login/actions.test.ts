// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const { redirectMock, setAdminSessionMock, clearAdminSessionMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  setAdminSessionMock: vi.fn(),
  clearAdminSessionMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("../../../lib/auth/server", () => ({
  setAdminSession: setAdminSessionMock,
  clearAdminSession: clearAdminSessionMock,
}));

import { loginAdmin, logoutAdmin } from "./actions";

describe("admin login actions", () => {
  it("constrains successful redirects to the admin area", async () => {
    vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
    vi.stubEnv("ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("ADMIN_SESSION_SECRET", "admin-session-secret-for-action-tests-1234567890");
    redirectMock.mockImplementationOnce((target: string) => {
      throw new Error(`REDIRECT:${target}`);
    });

    const formData = new FormData();
    formData.set("email", "admin@example.com");
    formData.set("password", "correct-password");
    formData.set("next", "/shop");

    await expect(loginAdmin({}, formData)).rejects.toThrow("REDIRECT:/admin");
    expect(setAdminSessionMock).toHaveBeenCalledWith("admin@example.com");
    vi.unstubAllEnvs();
  });

  it("clears the admin session and redirects to login", async () => {
    redirectMock.mockImplementationOnce((target: string) => {
      throw new Error(`REDIRECT:${target}`);
    });

    await expect(logoutAdmin()).rejects.toThrow("REDIRECT:/admin/login");
    expect(clearAdminSessionMock).toHaveBeenCalledOnce();
  });
});
