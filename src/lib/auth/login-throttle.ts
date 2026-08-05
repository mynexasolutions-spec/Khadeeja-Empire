import "server-only";

import { createHash } from "node:crypto";

export interface AdminLoginRequestContext {
  ip?: string;
  userAgent?: string;
}

export interface AdminLoginLimiterOptions {
  maxFailedAttempts?: number;
  lockoutMs?: number;
  maxEntries?: number;
}

export interface AdminLoginThrottleResult {
  locked: boolean;
  retryAfterMs: number;
  attemptsRemaining: number;
}

interface LoginFailureState {
  failedAttempts: number;
  lockedUntil: number;
  lastFailureAt: number;
}

const DEFAULT_MAX_FAILED_ATTEMPTS = 5;
const DEFAULT_LOCKOUT_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 10_000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function keyFor(email: string, context: AdminLoginRequestContext): string {
  const requestContext = [context.ip?.trim(), context.userAgent?.trim()]
    .filter(Boolean)
    .join("|");
  return createHash("sha256")
    .update(`${normalizeEmail(email)}|${requestContext}`, "utf8")
    .digest("hex");
}

export function createAdminLoginLimiter(options: AdminLoginLimiterOptions = {}) {
  const maxFailedAttempts = Math.max(1, options.maxFailedAttempts ?? DEFAULT_MAX_FAILED_ATTEMPTS);
  const lockoutMs = Math.max(1, options.lockoutMs ?? DEFAULT_LOCKOUT_MS);
  const maxEntries = Math.max(1, options.maxEntries ?? DEFAULT_MAX_ENTRIES);
  const failures = new Map<string, LoginFailureState>();

  function prune(now: number) {
    for (const [key, state] of failures) {
      if (state.lockedUntil <= now && state.lastFailureAt + lockoutMs <= now) {
        failures.delete(key);
      }
    }
  }

  function isLocked(
    email: string,
    context: AdminLoginRequestContext = {},
    now = Date.now()
  ): AdminLoginThrottleResult {
    prune(now);
    const state = failures.get(keyFor(email, context));
    if (!state || state.lockedUntil <= now) {
      return {
        locked: false,
        retryAfterMs: 0,
        attemptsRemaining: maxFailedAttempts - (state?.failedAttempts ?? 0),
      };
    }
    return {
      locked: true,
      retryAfterMs: state.lockedUntil - now,
      attemptsRemaining: 0,
    };
  }

  function recordFailure(
    email: string,
    context: AdminLoginRequestContext = {},
    now = Date.now()
  ): AdminLoginThrottleResult {
    prune(now);
    const key = keyFor(email, context);
    const current = failures.get(key);
    if (current?.lockedUntil && current.lockedUntil > now) {
      return {
        locked: true,
        retryAfterMs: current.lockedUntil - now,
        attemptsRemaining: 0,
      };
    }

    if (!current && failures.size >= maxEntries) {
      const oldestKey = failures.keys().next().value;
      if (oldestKey) failures.delete(oldestKey);
    }

    const failedAttempts = (current?.failedAttempts ?? 0) + 1;
    const locked = failedAttempts >= maxFailedAttempts;
    const state = {
      failedAttempts,
      lockedUntil: locked ? now + lockoutMs : 0,
      lastFailureAt: now,
    };
    failures.set(key, state);

    return {
      locked,
      retryAfterMs: locked ? lockoutMs : 0,
      attemptsRemaining: Math.max(0, maxFailedAttempts - failedAttempts),
    };
  }

  function reset(email: string, context: AdminLoginRequestContext = {}) {
    failures.delete(keyFor(email, context));
  }

  return { isLocked, recordFailure, reset };
}

export const adminLoginLimiter = createAdminLoginLimiter();

export function formatLoginRetry(retryAfterMs: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return `Too many failed attempts. Try again in ${seconds} seconds.`;
}
