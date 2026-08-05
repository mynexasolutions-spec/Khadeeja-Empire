import { NextResponse } from "next/server";
import {
  CUSTOMER_OTP_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  createSessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const expired = createSessionCookieOptions(new Date(0));
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", expired);
  response.cookies.set(CUSTOMER_OTP_COOKIE, "", expired);
  return response;
}
