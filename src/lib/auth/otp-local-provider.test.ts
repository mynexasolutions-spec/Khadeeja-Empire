// @vitest-environment node

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createLocalProvider } from "../data/local-provider";
import {
  createProviderOtpChallengeStore,
  requestOtpChallenge,
  verifyOtpChallenge,
} from "./otp";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("provider-backed OTP with local persistence", () => {
  it("can verify state from a second local provider instance", async () => {
    const directory = await mkdtemp(join(tmpdir(), "khadeeja-otp-provider-"));
    directories.push(directory);
    const filePath = join(directory, "admin.json");
    const firstProvider = createLocalProvider({ filePath });
    const secondProvider = createLocalProvider({ filePath });
    const phone = "+919876543218";
    const challenge = await requestOtpChallenge(
      createProviderOtpChallengeStore(firstProvider),
      phone
    );

    await expect(
      verifyOtpChallenge(
        createProviderOtpChallengeStore(secondProvider),
        challenge.id,
        phone,
        "12345"
      )
    ).resolves.toBe(true);
  });
});
