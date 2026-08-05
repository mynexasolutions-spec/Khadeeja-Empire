"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ConfigurationError } from "../../../lib/admin/errors";
import { authenticateAdmin, getAdminAuthConfig } from "../../../lib/auth/config";
import { adminLoginLimiter, formatLoginRetry } from "../../../lib/auth/login-throttle";
import { clearAdminSession, setAdminSession } from "../../../lib/auth/server";
import { safeAdminRedirectPath } from "../../../lib/auth/redirect";

export interface AdminLoginState {
  error?: string;
}

async function getRequestContext() {
  try {
    const requestHeaders = await headers();
    return {
      ip:
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        requestHeaders.get("x-real-ip")?.trim(),
      userAgent: requestHeaders.get("user-agent")?.trim(),
    };
  } catch {
    return {};
  }
}

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  let config;
  try {
    config = getAdminAuthConfig();
  } catch (error) {
    if (error instanceof ConfigurationError) return { error: error.message };
    return { error: "Admin authentication configuration is unavailable." };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  const next = safeAdminRedirectPath(formData.get("next"));

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Enter your email and password." };
  }

  const context = await getRequestContext();
  const lockout = adminLoginLimiter.isLocked(email, context);
  if (lockout.locked) return { error: formatLoginRetry(lockout.retryAfterMs) };

  if (!authenticateAdmin(email, password, config)) {
    const failure = adminLoginLimiter.recordFailure(email, context);
    if (failure.locked) return { error: formatLoginRetry(failure.retryAfterMs) };
    return { error: "The email or password is incorrect." };
  }

  await setAdminSession(config.email);
  adminLoginLimiter.reset(email, context);
  redirect(next);
}

export async function logoutAdmin(): Promise<never> {
  await clearAdminSession();
  redirect("/admin/login");
}
