import { describe, expect, it } from "vitest";
import { ConfigurationError } from "../admin/errors";
import { authenticateAdmin, getAdminAuthConfig, getCustomerAuthConfig } from "./config";

const sessionSecret = "admin-session-secret-for-tests-only-1234567890";

describe("admin auth configuration", () => {
  it("requires every admin credential and session secret", () => {
    for (const name of ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"] as const) {
      const env = {
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD: "correct-password",
        ADMIN_SESSION_SECRET: sessionSecret,
      };
      delete env[name];

      expect(() => getAdminAuthConfig(env)).toThrow(ConfigurationError);
      expect(() => getAdminAuthConfig(env)).toThrow(new RegExp(name));
    }
  });

  it("normalizes the configured admin email without changing the password", () => {
    expect(
      getAdminAuthConfig({
        ADMIN_EMAIL: "  Admin@Example.com ",
        ADMIN_PASSWORD: " exact password ",
        ADMIN_SESSION_SECRET: ` ${sessionSecret} `,
      })
    ).toMatchObject({
      email: "admin@example.com",
      password: " exact password ",
      sessionSecret,
    });
  });

  it("authenticates only the configured email and password", () => {
    const config = getAdminAuthConfig({
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "correct-password",
      ADMIN_SESSION_SECRET: sessionSecret,
    });

    expect(authenticateAdmin("ADMIN@example.com", "correct-password", config)).toBe(true);
    expect(authenticateAdmin("admin@example.com", "wrong-password", config)).toBe(false);
    expect(authenticateAdmin("other@example.com", "correct-password", config)).toBe(false);
  });
});

describe("customer session configuration", () => {
  it("uses the customer secret when one is configured and never exposes it", () => {
    const config = getCustomerAuthConfig({
      CUSTOMER_SESSION_SECRET: "customer-session-secret-for-tests-only-1234567890",
      ADMIN_SESSION_SECRET: sessionSecret,
    });

    expect(config).toMatchObject({ audience: "customer" });
    expect("secret" in config).toBe(false);
  });

  it("falls back to the admin session secret only when no customer secret exists", () => {
    expect(
      getCustomerAuthConfig({ ADMIN_SESSION_SECRET: sessionSecret })
    ).toMatchObject({ audience: "customer" });
  });

  it("rejects customer sessions when neither session secret exists", () => {
    expect(() => getCustomerAuthConfig({})).toThrow(ConfigurationError);
  });
});
