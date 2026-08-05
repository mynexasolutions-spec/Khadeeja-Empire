// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  createSessionCookieOptions,
  signAdminSession,
  signCustomerSession,
  verifyAdminSession,
  verifyCustomerSession,
} from "./session";
import { getAdminAuthConfig, getCustomerAuthConfig } from "./config";

const config = getAdminAuthConfig({
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD: "correct-password",
  ADMIN_SESSION_SECRET: "admin-session-secret-for-tests-only-1234567890",
});

describe("admin sessions", () => {
  it("signs and verifies minimal admin claims with issuer, audience, and expiry", async () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const token = await signAdminSession({ email: config.email }, config, now);
    const session = await verifyAdminSession(token, config, now + 1_000);

    expect(session).toMatchObject({ role: "admin", email: "admin@example.com" });
    expect(session?.iss).toBe("khadeeja-empire");
    expect(session?.aud).toBe("admin");
    expect(session?.exp).toBeGreaterThan(Math.floor(now / 1000));
    expect(token).not.toContain("correct-password");
    expect(token).not.toContain(config.sessionSecret);
  });

  it("rejects tampered, expired, and wrong-audience tokens", async () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const token = await signAdminSession({ email: config.email }, config, now);

    await expect(verifyAdminSession(`${token}tampered`, config, now)).resolves.toBeNull();
    await expect(
      verifyAdminSession(token, { ...config, audience: "customer" as "admin" }, now)
    ).resolves.toBeNull();
    await expect(
      verifyAdminSession(token, config, now + config.sessionTtlSeconds * 1_000 + 1)
    ).resolves.toBeNull();
  });

  it("sets an explicit secure HTTP-only session cookie policy", () => {
    const expires = new Date("2026-01-01T00:15:00.000Z");

    expect(createSessionCookieOptions(expires, false)).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expires,
    });
    expect(createSessionCookieOptions(expires, true).secure).toBe(true);
    expect(ADMIN_SESSION_COOKIE).toBe("ke_admin_session");
  });

  it("uses a separate customer audience and cookie session", async () => {
    const customerConfig = getCustomerAuthConfig({
      CUSTOMER_SESSION_SECRET: "customer-session-secret-for-tests-only-1234567890",
    });
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const token = await signCustomerSession(
      { customerId: "customer-1", phone: "+919876543210" },
      customerConfig,
      now
    );
    const session = await verifyCustomerSession(token, customerConfig, now);

    expect(session).toMatchObject({
      role: "customer",
      customerId: "customer-1",
      phone: "+919876543210",
      aud: "customer",
    });
    expect(CUSTOMER_SESSION_COOKIE).toBe("ke_customer_session");
  });
});
