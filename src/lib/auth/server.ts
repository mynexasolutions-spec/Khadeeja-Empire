import "server-only";

import { cookies } from "next/headers";
import {
  getAdminAuthConfig,
  getCustomerAuthConfig,
  type AdminAuthConfig,
  type CustomerAuthConfig,
} from "./config";
import { UnauthorizedError } from "./errors";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  createSessionCookieOptions,
  signAdminSession,
  signCustomerSession,
  verifyAdminSession,
  verifyCustomerSession,
} from "./session";

function sessionExpiry(now: number, ttlSeconds: number): Date {
  return new Date(now + ttlSeconds * 1_000);
}

export async function requireAdmin(config: AdminAuthConfig = getAdminAuthConfig()) {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
    config
  );
  if (!session) throw new UnauthorizedError("Admin authentication is required.");
  return session;
}

export async function requireCustomer(
  config: CustomerAuthConfig = getCustomerAuthConfig()
) {
  const cookieStore = await cookies();
  const session = await verifyCustomerSession(
    cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value,
    config
  );
  if (!session) throw new UnauthorizedError("Customer authentication is required.");
  return session;
}

export async function setAdminSession(email: string): Promise<void> {
  const config = getAdminAuthConfig();
  const now = Date.now();
  const token = await signAdminSession({ email }, config, now);
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    token,
    createSessionCookieOptions(sessionExpiry(now, config.sessionTtlSeconds))
  );
}

export async function setCustomerSession(
  customerId: string,
  phone: string,
  config: CustomerAuthConfig = getCustomerAuthConfig()
): Promise<void> {
  const now = Date.now();
  const token = await signCustomerSession({ customerId, phone }, config, now);
  const cookieStore = await cookies();
  cookieStore.set(
    CUSTOMER_SESSION_COOKIE,
    token,
    createSessionCookieOptions(sessionExpiry(now, config.sessionTtlSeconds))
  );
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    "",
    createSessionCookieOptions(new Date(0))
  );
}

export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    CUSTOMER_SESSION_COOKIE,
    "",
    createSessionCookieOptions(new Date(0))
  );
}
