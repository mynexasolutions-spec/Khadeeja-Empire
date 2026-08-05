// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { JsonValue } from "../../../../lib/admin/types";

const { provider, settings } = vi.hoisted(() => {
  const storedSettings = new Map<string, JsonValue>();
  const fakeProvider = {
    getSetting: vi.fn(async (key: string) => {
      const value = storedSettings.get(key);
      return value === undefined ? null : { id: key, key, value };
    }),
    upsertSetting: vi.fn(async (key: string, value: JsonValue) => {
      storedSettings.set(key, value);
      return { id: key, key, value };
    }),
    deleteSetting: vi.fn(async (key: string) => {
      if (!storedSettings.delete(key)) throw Object.assign(new Error("missing"), { code: "not_found" });
    }),
    upsertCustomerByPhone: vi.fn(async (phone: string) => ({
      id: "customer-1",
      phone,
      status: "active",
    })),
  };
  return { provider: fakeProvider, settings: storedSettings };
});

vi.mock("server-only", () => ({}));
vi.mock("../../../../lib/data", () => ({ getDataProvider: () => provider }));

import {
  createProviderOtpChallengeStore,
  requestOtpChallenge,
} from "../../../../lib/auth/otp";
import { POST } from "./route";

describe("verify OTP route", () => {
  beforeEach(() => {
    settings.clear();
    vi.stubEnv("ADMIN_SESSION_SECRET", "customer-session-secret-for-route-tests-1234567890");
    provider.upsertCustomerByPhone.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a customer session, clears the challenge cookie, and enforces cookie flags", async () => {
    const phone = "+919876543217";
    const challenge = await requestOtpChallenge(
      createProviderOtpChallengeStore(provider),
      phone
    );
    const request = () =>
      new NextRequest("http://localhost/api/customer/verify-otp", {
        method: "POST",
        headers: {
          cookie: `ke_customer_otp=${challenge.id}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ phone, code: "12345", next: "/account" }),
      });

    const response = await POST(request());
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(await response.text()).not.toContain("12345");
    expect(provider.upsertCustomerByPhone).toHaveBeenCalledWith(phone, { status: "active" });
    expect(setCookie).toContain("ke_customer_session=");
    expect(setCookie).toContain("ke_customer_otp=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=lax");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("Expires=");

    expect((await POST(request())).status).toBe(401);
  });
});
