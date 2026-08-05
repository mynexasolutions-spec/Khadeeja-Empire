import { describe, expect, it, vi } from "vitest";
import { createAdminLoginLimiter } from "./login-throttle";

vi.mock("server-only", () => ({}));

describe("admin login throttling", () => {
  it("locks a normalized email and request context after repeated failures", () => {
    const limiter = createAdminLoginLimiter({ maxFailedAttempts: 3, lockoutMs: 60_000 });
    const context = { ip: "203.0.113.8", userAgent: "test-agent" };

    limiter.recordFailure(" Admin@Example.com ", context, 1_000);
    limiter.recordFailure("admin@example.com", context, 2_000);
    const locked = limiter.recordFailure("ADMIN@example.com", context, 3_000);

    expect(locked.locked).toBe(true);
    expect(limiter.isLocked("admin@example.com", context, 3_001)).toMatchObject({
      locked: true,
      retryAfterMs: 59_999,
    });
    expect(limiter.isLocked("admin@example.com", { ip: "203.0.113.9" }, 3_001).locked).toBe(false);
  });

  it("resets failed attempts after a successful login", () => {
    const limiter = createAdminLoginLimiter({ maxFailedAttempts: 2, lockoutMs: 60_000 });
    const context = { ip: "203.0.113.10" };

    limiter.recordFailure("admin@example.com", context, 1_000);
    limiter.reset("ADMIN@example.com", context);
    expect(limiter.recordFailure("admin@example.com", context, 2_000).locked).toBe(false);
  });
});
