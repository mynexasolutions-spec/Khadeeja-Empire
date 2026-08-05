import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import type { JWTPayload } from "jose";
import type { AdminAuthConfig, CustomerAuthConfig } from "./config";

export const ADMIN_SESSION_COOKIE = "ke_admin_session";
export const CUSTOMER_SESSION_COOKIE = "ke_customer_session";
export const CUSTOMER_OTP_COOKIE = "ke_customer_otp";

export interface AdminSession extends JWTPayload {
  role: "admin";
  email: string;
}

export interface CustomerSession extends JWTPayload {
  role: "customer";
  customerId: string;
  phone: string;
}

export interface SessionCookieOptions {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  expires: Date;
  maxAge: number;
}

function secretBytes(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

function expiration(now: number, ttlSeconds: number): number {
  return Math.floor(now / 1000) + ttlSeconds;
}

export function createSessionCookieOptions(
  expires: Date,
  secure = process.env.NODE_ENV === "production"
): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires,
    maxAge: Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000)),
  };
}

export async function signAdminSession(
  input: { email: string },
  config: Pick<AdminAuthConfig, "sessionSecret" | "issuer" | "audience" | "sessionTtlSeconds">,
  now = Date.now()
): Promise<string> {
  return new SignJWT({ role: "admin", email: input.email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(now / 1000))
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setExpirationTime(expiration(now, config.sessionTtlSeconds))
    .sign(secretBytes(config.sessionSecret));
}

export async function verifyAdminSession(
  token: string | undefined,
  config: Pick<AdminAuthConfig, "email" | "sessionSecret" | "issuer" | "audience">,
  now = Date.now()
): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<AdminSession>(token, secretBytes(config.sessionSecret), {
      algorithms: ["HS256"],
      issuer: config.issuer,
      audience: config.audience,
      currentDate: new Date(now),
    });

    if (
      payload.role !== "admin" ||
      typeof payload.email !== "string" ||
      payload.email.trim().toLowerCase() !== config.email
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function signCustomerSession(
  input: { customerId: string; phone: string },
  config: Pick<CustomerAuthConfig, "sessionSecret" | "issuer" | "audience" | "sessionTtlSeconds">,
  now = Date.now()
): Promise<string> {
  return new SignJWT({ role: "customer", customerId: input.customerId, phone: input.phone })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(now / 1000))
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setExpirationTime(expiration(now, config.sessionTtlSeconds))
    .sign(secretBytes(config.sessionSecret));
}

export async function verifyCustomerSession(
  token: string | undefined,
  config: Pick<CustomerAuthConfig, "sessionSecret" | "issuer" | "audience">,
  now = Date.now()
): Promise<CustomerSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<CustomerSession>(
      token,
      secretBytes(config.sessionSecret),
      {
        algorithms: ["HS256"],
        issuer: config.issuer,
        audience: config.audience,
        currentDate: new Date(now),
      }
    );

    if (
      payload.role !== "customer" ||
      typeof payload.customerId !== "string" ||
      typeof payload.phone !== "string"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
