import { describe, expect, it, vi } from "vitest";
import type { JsonValue } from "../admin/types";
import {
  createMemoryOtpChallengeStore,
  createProviderOtpChallengeStore,
  hashPhone,
  requestOtpChallenge,
  verifyOtpChallenge,
  OTP_COOLDOWN_MS,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_REQUESTS,
  OTP_REQUEST_WINDOW_MS,
  normalizePhone,
} from "./otp";

vi.mock("server-only", () => ({}));

describe("mock customer OTP", () => {
  it("normalizes and validates phone-only input", () => {
    expect(normalizePhone(" +91 (98765) 43210 ")).toBe("+919876543210");
    expect(() => normalizePhone("not-a-phone")).toThrow();
  });

  it("creates expiring server-side state without returning the OTP", () => {
    const store = createMemoryOtpChallengeStore();
    const challengePromise = requestOtpChallenge(store, "+919876543210", 1_700_000_000_000);

    return expect(challengePromise).resolves.toMatchObject({
      id: expect.stringMatching(/^[a-f0-9-]+$/),
      expiresAt: expect.any(Number),
    });
  });

  it("accepts only the demo code once before expiry", async () => {
    const now = 1_700_000_000_000;
    const store = createMemoryOtpChallengeStore();
    const challenge = await requestOtpChallenge(store, "+919876543211", now);

    expect(await verifyOtpChallenge(store, challenge.id, "+919876543211", "00000", now + 1)).toBe(false);
    expect(await verifyOtpChallenge(store, challenge.id, "+919876543211", "12345", now + 2)).toBe(true);
    expect(await verifyOtpChallenge(store, challenge.id, "+919876543211", "12345", now + 3)).toBe(false);
  });

  it("rejects a mismatched phone and expired challenge", async () => {
    const now = 1_700_000_000_000;
    const store = createMemoryOtpChallengeStore();
    const challenge = await requestOtpChallenge(store, "+919876543212", now);

    expect(await verifyOtpChallenge(store, challenge.id, "+919876543213", "12345", now + 1)).toBe(false);
    await expect(
      verifyOtpChallenge(store, challenge.id, "+919876543212", "12345", challenge.expiresAt + 1)
    ).resolves.toBe(false);
  });

  it("enforces request cooldown and a bounded request window", async () => {
    const phone = "+919876543214";
    const now = 1_700_000_100_000;
    const store = createMemoryOtpChallengeStore();
    await requestOtpChallenge(store, phone, now);

    await expect(requestOtpChallenge(store, phone, now + OTP_COOLDOWN_MS - 1)).rejects.toThrow(
      /wait/i
    );

    for (let request = 1; request < OTP_MAX_REQUESTS; request += 1) {
      await requestOtpChallenge(store, phone, now + request * OTP_COOLDOWN_MS);
    }

    await expect(
      requestOtpChallenge(store, phone, now + (OTP_MAX_REQUESTS + 1) * OTP_COOLDOWN_MS)
    ).rejects.toThrow(/too many/i);
    expect(OTP_REQUEST_WINDOW_MS).toBeGreaterThan(OTP_MAX_REQUESTS * OTP_COOLDOWN_MS);
  });

  it("locks a challenge after the maximum failed attempts", async () => {
    const phone = "+919876543215";
    const now = 1_700_000_200_000;
    const store = createMemoryOtpChallengeStore();
    const challenge = await requestOtpChallenge(store, phone, now);

    for (let attempt = 0; attempt < OTP_MAX_ATTEMPTS; attempt += 1) {
      expect(await verifyOtpChallenge(store, challenge.id, phone, "00000", now + attempt + 1)).toBe(false);
    }

    expect(await verifyOtpChallenge(store, challenge.id, phone, "12345", now + 10)).toBe(false);
  });

  it("stores challenge state under a hashed phone key across provider store instances", async () => {
    const values = new Map<string, JsonValue>();
    const provider = {
      async getSetting(key: string) {
        const value = values.get(key);
        return value === undefined ? null : { id: key, key, value };
      },
      async upsertSetting(key: string, value: JsonValue) {
        values.set(key, value);
        return { id: key, key, value };
      },
      async deleteSetting(key: string) {
        if (!values.delete(key)) throw Object.assign(new Error("missing"), { code: "not_found" });
      },
    };
    const phone = "+919876543216";
    const firstStore = createProviderOtpChallengeStore(provider);
    const secondStore = createProviderOtpChallengeStore(provider);
    const challenge = await requestOtpChallenge(firstStore, phone, 1_700_000_300_000);

    expect([...values.keys()]).toEqual([`auth.otp.challenge.${hashPhone(phone)}`]);
    expect(JSON.stringify([...values.values()])).not.toContain("12345");
    expect(
      await verifyOtpChallenge(secondStore, challenge.id, phone, "12345", 1_700_000_300_001)
    ).toBe(true);
    expect(values.size).toBe(0);
  });
});
