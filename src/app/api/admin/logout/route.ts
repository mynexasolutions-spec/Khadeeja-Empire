import { NextResponse } from "next/server";
import { authErrorResponse } from "@/lib/auth/http";
import { requireAdmin } from "@/lib/auth/server";
import { ADMIN_SESSION_COOKIE, createSessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireAdmin();
  } catch (error) {
    return authErrorResponse(error);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    createSessionCookieOptions(new Date(0))
  );
  return response;
}
