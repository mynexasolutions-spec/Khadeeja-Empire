import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../../../../../lib/auth/errors";

const { requireAdminMock } = vi.hoisted(() => ({ requireAdminMock: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("../../../../../lib/auth/server", () => ({ requireAdmin: requireAdminMock }));

import { POST } from "./route";

describe("admin media signature route", () => {
  it("requires admin authentication before inspecting upload input", async () => {
    requireAdminMock.mockRejectedValueOnce(new UnauthorizedError());

    const response = await POST(
      new Request("http://localhost/api/admin/media/signature", {
        method: "POST",
        body: "not-json",
      })
    );

    expect(response.status).toBe(401);
  });

  it("returns a validated local asset without pretending a Cloudinary upload occurred", async () => {
    requireAdminMock.mockResolvedValueOnce({ role: "admin" });

    const response = await POST(
      new Request("http://localhost/api/admin/media/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          folder: "khadeeja/products",
          resourceType: "image",
          localUrl: "/assets/logo.png",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      mode: "local",
      url: "/assets/logo.png",
      resourceType: "image",
    });
  });

  it("returns only public Cloudinary signing fields after metadata validation", async () => {
    requireAdminMock.mockResolvedValueOnce({ role: "admin" });
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "demo-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_API_KEY", "demo-api-key");
    vi.stubEnv("CLOUDINARY_API_SECRET", "cloudinary-secret-for-route-tests");

    const response = await POST(
      new Request("http://localhost/api/admin/media/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          folder: "khadeeja/products",
          resourceType: "image",
          format: "png",
          fileSize: 1024,
        }),
      })
    );
    const result = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(result).toEqual(
      expect.objectContaining({
        cloud_name: "demo-cloud",
        api_key: "demo-api-key",
        folder: "khadeeja/products",
      })
    );
    expect(result).not.toHaveProperty("api_secret");
    expect(result).not.toHaveProperty("format");
    vi.unstubAllEnvs();
  });
});
