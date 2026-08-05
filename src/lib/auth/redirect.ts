export function safeRedirectPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const path = value.trim();
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  if (path.includes("\\") || path.includes("\n") || path.includes("\r")) return fallback;
  return path;
}

export function safeAdminRedirectPath(value: unknown, fallback = "/admin"): string {
  const safeFallback =
    fallback === "/admin" || fallback.startsWith("/admin/") ? fallback : "/admin";
  const path = safeRedirectPath(value, safeFallback);
  return path === "/admin" || path.startsWith("/admin/") ? path : safeFallback;
}
