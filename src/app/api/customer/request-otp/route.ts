import { NextResponse } from "next/server";
import { z } from "zod";
import { getDataProvider } from "../../../../lib/data";
import {
  createProviderOtpChallengeStore,
  normalizePhone,
  OTP_TTL_MS,
  OtpRateLimitError,
  requestOtpChallenge,
} from "../../../../lib/auth/otp";
import { authErrorResponse } from "../../../../lib/auth/http";
import {
  CUSTOMER_OTP_COOKIE,
  createSessionCookieOptions,
} from "../../../../lib/auth/session";

export const runtime = "nodejs";

const requestSchema = z.object({ phone: z.string().min(1).max(40) }).strict();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  let phone: string;
  try {
    phone = normalizePhone(parsed.data.phone);
  } catch {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const now = Date.now();
  let challenge;
  try {
    const provider = getDataProvider();
    challenge = await requestOtpChallenge(
      createProviderOtpChallengeStore(provider),
      phone,
      now
    );
  } catch (error) {
    if (error instanceof OtpRateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: { "retry-after": String(Math.max(1, Math.ceil(error.retryAfterMs / 1000))) },
        }
      );
    }
    return authErrorResponse(error);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    CUSTOMER_OTP_COOKIE,
    challenge.id,
    createSessionCookieOptions(new Date(now + OTP_TTL_MS))
  );
  return response;
}
