export const CLOUDINARY_RESOURCE_TYPES = ["image", "video", "raw"] as const;
export type CloudinaryResourceType = (typeof CLOUDINARY_RESOURCE_TYPES)[number];

export interface LocalMediaResult {
  mode: "local";
  url: string;
  resourceType: CloudinaryResourceType;
}

export interface UploadUrlOptions {
  cloudName: string | undefined;
  resourceType: CloudinaryResourceType;
  localFallback: string;
  origin?: string;
}

function isSafePath(value: string): boolean {
  return !value.includes("\\") && !/[\u0000-\u001f\u007f]/.test(value);
}

export function resolveLocalAssetUrl(value: unknown, origin?: string): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || !isSafePath(normalized)) return null;

  if (normalized.startsWith("/")) {
    if (normalized.startsWith("//")) return null;
    try {
      const parsed = new URL(normalized, "https://local-assets.invalid");
      return parsed.pathname.startsWith("/assets/") ? normalized : null;
    } catch {
      return null;
    }
  }

  if (!origin) return null;
  try {
    const expectedOrigin = new URL(origin).origin;
    const parsed = new URL(normalized);
    if (
      (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
      parsed.origin !== expectedOrigin ||
      parsed.username ||
      parsed.password ||
      !parsed.pathname.startsWith("/assets/")
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function createLocalMediaResult(
  value: unknown,
  resourceType: CloudinaryResourceType,
  origin?: string
): LocalMediaResult | null {
  const url = resolveLocalAssetUrl(value, origin);
  return url ? { mode: "local", url, resourceType } : null;
}

export function getCloudinaryUploadUrl({
  cloudName,
  resourceType,
  localFallback,
  origin,
}: UploadUrlOptions): string {
  const normalizedCloudName = cloudName?.trim();
  if (
    !normalizedCloudName ||
    !/^[A-Za-z0-9_-]+$/.test(normalizedCloudName) ||
    !CLOUDINARY_RESOURCE_TYPES.includes(resourceType)
  ) {
    const localUrl = resolveLocalAssetUrl(localFallback, origin);
    if (!localUrl) {
      throw new Error("A valid /assets/... local fallback is required when Cloudinary is unavailable.");
    }
    return localUrl;
  }

  return `https://api.cloudinary.com/v1_1/${encodeURIComponent(normalizedCloudName)}/${resourceType}/upload`;
}
