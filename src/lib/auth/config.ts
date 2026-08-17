import { ConfigurationError } from "../admin/errors";

export const AUTH_ISSUER = "khadeeja-empire";
export const ADMIN_AUDIENCE = "admin";
export const CUSTOMER_AUDIENCE = "customer";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60;
export const CUSTOMER_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface AdminAuthConfig {
  email: string;
  password: string;
  sessionSecret: string;
  issuer: typeof AUTH_ISSUER;
  audience: typeof ADMIN_AUDIENCE;
  sessionTtlSeconds: number;
}

export interface CustomerAuthConfig {
  sessionSecret: string;
  issuer: typeof AUTH_ISSUER;
  audience: typeof CUSTOMER_AUDIENCE;
  sessionTtlSeconds: number;
}

type AuthEnv = Record<string, string | undefined>;

function requiredValue(env: AuthEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new ConfigurationError(`Missing required admin auth configuration: ${name}.`);
  return value;
}

function requiredPassword(env: AuthEnv): string {
  const value = env.ADMIN_PASSWORD;
  if (!value?.trim()) {
    throw new ConfigurationError("Missing required admin auth configuration: ADMIN_PASSWORD.");
  }
  return value;
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export function getAdminAuthConfig(env: AuthEnv = process.env): AdminAuthConfig {
  const email = requiredValue(env, "ADMIN_EMAIL").toLowerCase();
  const password = requiredPassword(env);
  const sessionSecret = requiredValue(env, "ADMIN_SESSION_SECRET");

  return {
    email,
    password,
    sessionSecret,
    issuer: AUTH_ISSUER,
    audience: ADMIN_AUDIENCE,
    sessionTtlSeconds: ADMIN_SESSION_TTL_SECONDS,
  };
}

export function getCustomerAuthConfig(env: AuthEnv = process.env): CustomerAuthConfig {
  const sessionSecret = env.CUSTOMER_SESSION_SECRET?.trim() || env.ADMIN_SESSION_SECRET?.trim();
  if (!sessionSecret) {
    throw new ConfigurationError(
      "Missing customer session configuration: set CUSTOMER_SESSION_SECRET or ADMIN_SESSION_SECRET."
    );
  }

  return {
    sessionSecret,
    issuer: AUTH_ISSUER,
    audience: CUSTOMER_AUDIENCE,
    sessionTtlSeconds: CUSTOMER_SESSION_TTL_SECONDS,
  };
}

export function authenticateAdmin(
  email: string,
  password: string,
  config: Pick<AdminAuthConfig, "email" | "password">
): boolean {
  const emailMatches = constantTimeEqual(email.trim().toLowerCase(), config.email);
  const passwordMatches = constantTimeEqual(password, config.password);
  return emailMatches && passwordMatches;
}
