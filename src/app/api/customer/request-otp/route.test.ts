import { describe, expect, it, vi } from "vitest";
import type { JsonValue } from "../../../../lib/admin/types";

const { provider } = vi.hoisted(() => {
  const settings = new Map<string, JsonValue>();
  return {
    provider: {
      getSetting: vi.fn(async (key: string) => {
        const value = settings.get(key);
        return value === undefined ? null : { id: key, key, value };
      }),
      upsertSetting: vi.fn(async (key: string, value: JsonValue) => {
        settings.set(key, value);
        return { id: key, key, value };
      }),
      deleteSetting: vi.fn(async (key: string) => {
        settings.delete(key);
      }),
    },
  };
});

vi.mock("server-only", () => ({}));
vi.mock("../../../../lib/data", () => ({ getDataProvider: () => provider }));

import { POST } from "./route";

describe("request OTP route", () => {
  it("rejects a second request during the cooldown and never returns the code", async () => {
    const request = () =>
      new Request("http://localhost/api/customer/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: "+919876543216" }),
      });

    const first = await POST(request());
    expect(first.status).toBe(200);
    expect(await first.text()).not.toContain("12345");

    const second = await POST(request());
    expect(second.status).toBe(429);
    expect(second.headers.get("retry-after")).toBeTruthy();
  });
});
