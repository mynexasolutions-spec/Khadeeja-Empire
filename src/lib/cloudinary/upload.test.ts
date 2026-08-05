import { describe, expect, it } from "vitest";
import {
  createLocalMediaResult,
  getCloudinaryUploadUrl,
  resolveLocalAssetUrl,
} from "./upload";

describe("shared media upload target", () => {
  it("uses a local URL fallback when Cloudinary is unavailable", () => {
    expect(
      getCloudinaryUploadUrl({
        cloudName: "",
        resourceType: "image",
        localFallback: "/assets/images/existing.jpg",
      })
    ).toBe("/assets/images/existing.jpg");
  });

  it("builds a Cloudinary upload URL when a cloud name exists", () => {
    expect(
      getCloudinaryUploadUrl({
        cloudName: "demo-cloud",
        resourceType: "video",
        localFallback: "/assets/videos/existing.mp4",
      })
    ).toBe("https://api.cloudinary.com/v1_1/demo-cloud/video/upload");
  });

  it("accepts local assets and same-origin asset URLs only", () => {
    expect(resolveLocalAssetUrl("/assets/images/existing.jpg")).toBe(
      "/assets/images/existing.jpg"
    );
    expect(
      resolveLocalAssetUrl(
        "https://shop.example/assets/images/existing.jpg",
        "https://shop.example"
      )
    ).toBe("https://shop.example/assets/images/existing.jpg");
    expect(resolveLocalAssetUrl("https://cdn.example/assets/images/existing.jpg", "https://shop.example")).toBe(
      null
    );
    expect(resolveLocalAssetUrl("/uploads/existing.jpg")).toBe(null);
    expect(resolveLocalAssetUrl("//cdn.example/assets/existing.jpg")).toBe(null);
  });

  it("returns an explicit local media result instead of an upload result", () => {
    expect(
      createLocalMediaResult("/assets/images/existing.jpg", "image")
    ).toEqual({ mode: "local", url: "/assets/images/existing.jpg", resourceType: "image" });
  });
});
