"use client";

export default function StorefrontError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Store data unavailable</p><h1 className="mt-3 text-h1 text-ink">We could not load the collection</h1><p className="mt-4 leading-7 text-muted">If Supabase is configured, install the required schema from <code>database/schema.sql</code> and seed it before retrying. Local development uses the mock data store only when Supabase credentials are absent or placeholders.</p><button onClick={reset} className="mt-7 min-h-11 bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover">Try again</button></main>;
}
