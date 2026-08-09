import { NextResponse, type NextRequest } from "next/server";
import { ConfigurationError } from "./lib/admin/errors";
import { getAdminAuthConfig } from "./lib/auth/config";
import { refreshSupabaseSession } from "./lib/auth/supabase-middleware";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "./lib/auth/session";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

function isAdminApi(pathname: string): boolean {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

function configurationResponse(request: NextRequest, error: unknown): NextResponse {
  const message = error instanceof ConfigurationError
    ? error.message
    : "Admin authentication configuration is unavailable.";

  if (isAdminApi(request.nextUrl.pathname)) {
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return new NextResponse(message, { status: 500 });
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/admin/login";
  let response = NextResponse.next();

  if (isLogin) return refreshSupabaseSession(request, response);

  let config;
  try {
    config = getAdminAuthConfig();
  } catch (error) {
    return configurationResponse(request, error);
  }

  const session = await verifyAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    config
  );

  if (!session) {
    if (isAdminApi(pathname)) {
      return NextResponse.json({ error: "Admin authentication is required." }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  response = await refreshSupabaseSession(request, response);
  return response;
}
