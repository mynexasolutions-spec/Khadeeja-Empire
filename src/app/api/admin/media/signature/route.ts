import { NextResponse } from "next/server";
import { ConfigurationError } from "../../../../../lib/admin/errors";
import { authErrorResponse } from "../../../../../lib/auth/http";
import { requireAdmin } from "../../../../../lib/auth/server";
import {
  cloudinaryUploadRequestSchema,
  getCloudinaryServerConfig,
  mediaUploadRequestSchema,
  createCloudinaryUploadSignature,
} from "../../../../../lib/cloudinary/signature";
import { createExistingLocalMediaResult } from "../../../../../lib/cloudinary/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return authErrorResponse(error);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The media request is invalid." }, { status: 400 });
  }

  const parsed = mediaUploadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The media folder, format, resource type, and size are invalid." },
      { status: 400 }
    );
  }

  const localResult = parsed.data.localUrl
    ? await createExistingLocalMediaResult(
        parsed.data.localUrl,
        parsed.data.resourceType,
        new URL(request.url).origin
      )
    : null;
  if (parsed.data.localUrl && !localResult) {
    return NextResponse.json(
      { error: "Local media must be an existing /assets/... path on this site." },
      { status: 400 }
    );
  }
  if (localResult) return NextResponse.json(localResult);

  const cloudinaryInput = cloudinaryUploadRequestSchema.safeParse(parsed.data);
  if (!cloudinaryInput.success) {
    return NextResponse.json(
      { error: "Cloudinary uploads require an allowed format and file size." },
      { status: 400 }
    );
  }

  try {
    const signature = await createCloudinaryUploadSignature(
      cloudinaryInput.data,
      getCloudinaryServerConfig()
    );
    return NextResponse.json(signature);
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Provide a validated localUrl under /assets/." },
        { status: 503 }
      );
    }
    return authErrorResponse(error);
  }
}
