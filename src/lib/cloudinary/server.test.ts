// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { resolveExistingLocalAssetUrl } from "./server";

describe("server-side local media validation", () => {
  it("requires an existing public asset file and rejects traversal/query tricks", async () => {
    await expect(resolveExistingLocalAssetUrl("/assets/logo.png")).resolves.toBe(
      "/assets/logo.png"
    );
    await expect(resolveExistingLocalAssetUrl("/assets/does-not-exist.png")).resolves.toBeNull();
    await expect(resolveExistingLocalAssetUrl("/assets/../logo.png")).resolves.toBeNull();
    await expect(resolveExistingLocalAssetUrl("/assets/logo.png?download=1")).resolves.toBeNull();
    await expect(resolveExistingLocalAssetUrl("/assets/%2e%2e/logo.png")).resolves.toBeNull();
  });
});
