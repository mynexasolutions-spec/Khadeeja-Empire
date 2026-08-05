// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getAdminAuthConfig } from "./lib/auth/config";
import { signAdminSession } from "./lib/auth/session";

vi.mock("server-only", () => ({}));

import { middleware } from "./middleware";

afterEach(() => {
  vi.unstubAllEnvs();
});

function setAdminEnvironment() {
  vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
  vi.stubEnv("ADMIN_PASSWORD", "correct-password");
  vi.stubEnv("ADMIN_SESSION_SECRET", "admin-session-secret-for-route-tests-1234567890");
}

describe("admin middleware", () => {
  it("redirects unauthenticated admin pages and returns 401 for admin APIs", async () => {
    setAdminEnvironment();

    const pageResponse = await middleware(new NextRequest("http://localhost/admin/orders"));
    expect(pageResponse.status).toBe(307);
    expect(pageResponse.headers.get("location")).toContain("/admin/login");

    const apiResponse = await middleware(new NextRequest("http://localhost/api/admin/media/signature"));
    expect(apiResponse.status).toBe(401);
  });

  it("allows the login page and a valid signed admin session", async () => {
    setAdminEnvironment();
    const loginResponse = await middleware(new NextRequest("http://localhost/admin/login"));
    expect(loginResponse.status).toBe(200);

    const config = getAdminAuthConfig();
    const token = await signAdminSession({ email: config.email }, config);
    const request = new NextRequest("http://localhost/admin/orders", {
      headers: { cookie: `ke_admin_session=${token}` },
    });

    expect((await middleware(request)).status).toBe(200);
  });
});
