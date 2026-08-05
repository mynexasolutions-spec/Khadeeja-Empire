import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  cloudinaryUploadRequestSchema,
  createCloudinaryUploadSignature,
  mediaUploadRequestSchema,
} from "./signature";

vi.mock("server-only", () => ({}));

describe("Cloudinary upload signatures", () => {
  it("signs only the server-owned timestamp and validated folder", async () => {
    const timestamp = 1_700_000_000;
    const secret = "cloudinary-secret-for-tests-only";
    const expected = createHash("sha1")
      .update(`folder=khadeeja/products&timestamp=${timestamp}${secret}`)
      .digest("hex");

    await expect(
      createCloudinaryUploadSignature(
        {
          folder: "khadeeja/products",
          resourceType: "image",
          format: "png",
          fileSize: 1024,
        },
        {
          cloudName: "demo-cloud",
          apiKey: "demo-api-key",
          apiSecret: secret,
        },
        timestamp
      )
    ).resolves.toEqual({
      cloud_name: "demo-cloud",
      api_key: "demo-api-key",
      timestamp,
      folder: "khadeeja/products",
      signature: expected,
    });
  });

  it("rejects unsafe folders, resource types, and extra upload parameters", () => {
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "../secrets",
        resourceType: "image",
        format: "png",
        fileSize: 1024,
      })
    ).toThrow();
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "audio",
        format: "mp4",
        fileSize: 1024,
      })
    ).toThrow();
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "image",
        format: "png",
        fileSize: 1024,
        publicId: "not-allowed",
      })
    ).toThrow();
  });

  it("accepts only the supported folder allowlist", () => {
    expect(
      cloudinaryUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "video",
        format: "mp4",
        fileSize: 1024,
      })
    ).toEqual({
      folder: "khadeeja/products",
      resourceType: "video",
      format: "mp4",
      fileSize: 1024,
    });
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "private",
        resourceType: "image",
        format: "png",
        fileSize: 1024,
      })
    ).toThrow();
  });

  it("rejects mismatched formats and resource-specific size limits", () => {
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "image",
        format: "mp4",
        fileSize: 1024,
      })
    ).toThrow();
    expect(() =>
      cloudinaryUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "image",
        format: "png",
        fileSize: 11 * 1024 * 1024,
      })
    ).toThrow();
    expect(() =>
      mediaUploadRequestSchema.parse({
        folder: "khadeeja/products",
        resourceType: "image",
        localUrl: "/assets/images/existing.jpg",
      })
    ).not.toThrow();
  });
});
