import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDataProvider } from "../../../../lib/data";
import { getCustomerAuthConfig } from "../../../../lib/auth/config";
import { authErrorResponse } from "../../../../lib/auth/http";
import {
  createProviderOtpChallengeStore,
  normalizePhone,
  verifyOtpChallenge,
} from "../../../../lib/auth/otp";
import { safeRedirectPath } from "../../../../lib/auth/redirect";
import {
  CUSTOMER_OTP_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  createSessionCookieOptions,
  signCustomerSession,
} from "../../../../lib/auth/session";

export const runtime = "nodejs";

const verifySchema = z
  .object({
    phone: z.string().min(1).max(40),
    code: z.string().length(5),
    next: z.string().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The verification request is invalid." }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the five-digit verification code." }, { status: 400 });
  }

  let phone: string;
  try {
    phone = normalizePhone(parsed.data.phone);
  } catch {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const challengeId = request.cookies.get(CUSTOMER_OTP_COOKIE)?.value;
  let provider: ReturnType<typeof getDataProvider>;
  try {
    provider = getDataProvider();
    if (
      !challengeId ||
      !(await verifyOtpChallenge(
        createProviderOtpChallengeStore(provider),
        challengeId,
        phone,
        parsed.data.code
      ))
    ) {
      return NextResponse.json({ error: "That code is invalid or has expired." }, { status: 401 });
    }
  } catch (error) {
    return authErrorResponse(error);
  }

  let customerSessionConfig;
  try {
    customerSessionConfig = getCustomerAuthConfig();
  } catch (error) {
    return authErrorResponse(error);
  }

  try {
    const customer = await provider.upsertCustomerByPhone(phone, { status: "active" });
    const now = Date.now();
    const token = await signCustomerSession(
      { customerId: customer.id, phone },
      customerSessionConfig,
      now
    );
    const response = NextResponse.json({
      ok: true,
      redirectTo: safeRedirectPath(parsed.data.next, "/"),
    });

    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      token,
      createSessionCookieOptions(
        new Date(now + customerSessionConfig.sessionTtlSeconds * 1_000)
      )
    );
    response.cookies.set(
      CUSTOMER_OTP_COOKIE,
      "",
      createSessionCookieOptions(new Date(0))
    );
    return response;
  } catch (error) {
    return authErrorResponse(error);
  }
}
