import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

interface SupabaseSsrConfig {
  url: string;
  anonKey: string;
}

function getSupabaseSsrConfig(): SupabaseSsrConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey || url.includes("your-project") || anonKey.includes("your-")) {
    return null;
  }
  return { url, anonKey };
}

export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const config = getSupabaseSsrConfig();
  if (!config) return response;

  try {
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    await supabase.auth.getUser();
  } catch {
    // Supabase refresh is optional; the application session remains authoritative.
  }

  return response;
}
