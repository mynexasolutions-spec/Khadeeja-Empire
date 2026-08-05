# Admin Dashboard Integration Design

Date: 2026-08-05
Status: Approved design; implementation pending

## Goal

Add the complete HIJABISTAA-inspired admin suite to Khadeeja-Empire without replacing the existing storefront, assets, branding, or uncommitted user work. The admin UI keeps the reference dashboard's structure and interaction patterns while adapting its data model and security boundaries to this application.

## Runtime and Route Architecture

- Keep `src/app/layout.tsx` limited to document metadata, global styles, and fonts.
- Move existing public routes into a `(storefront)` route group with the existing `StoreShell`. Route URLs remain unchanged.
- Put `/admin/login` outside the protected group and put all other admin routes under `src/app/admin/(protected)`.
- Use middleware for early admin redirects and a protected server layout for a second session check.
- Scope admin colors, typography, borders, shadows, tables, forms, loading states, and empty states under admin-only styles so storefront styling is unchanged.

## Provider Migration

The provider is authoritative for both storefront and admin reads. Existing static content becomes seed input and compatibility data, not the runtime source of truth.

Shared provider contracts cover:

- Products, categories, colors, variants, images, and SEO data.
- Customers, profiles, orders, order items, addresses, and payment/status fields.
- Reviews, inquiries, subscribers, hero slides, Instagram posts, testimonials, FAQs, announcements, settings, coupons, and shipping configuration.

Two implementations share those contracts:

1. Supabase, selected when all required Supabase variables are configured. Use `@supabase/ssr` request clients for SSR/session refresh and a server-only service-role client for protected admin operations.
2. Local mock storage, selected when Supabase variables are missing or clearly placeholder values. Store the data in an atomic JSON file under `.data/`, outside `public/`, and seed it from the current catalog, categories, Instagram content, and media.

Partial Supabase configuration is a setup error. Once Supabase is selected, schema/query failures are surfaced as data errors and never silently fall back to local storage.

Explicit adapters map provider records to the existing storefront product/category types, preserving current slugs, collections, images under `/assets/...`, videos, sizes, tags, availability, prices, and prototype flags. Public pages consume provider-backed data through those adapters.

Provide `database/schema.sql`, explicit seed SQL or seed instructions, and local seed code. Do not perform destructive remote migrations automatically.

## Authentication and Trust Boundaries

- Admin login uses `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` only on the server.
- Issue a short-lived signed admin session cookie with `httpOnly`, `sameSite=lax`, production-only `secure`, `path=/`, and an explicit expiry. Do not put credentials or secrets in the cookie or logs.
- Verify the cookie in middleware, the protected admin layout, and every sensitive server action.
- Add optional Supabase SSR cookie refresh using the current `getAll`/`setAll` pattern. Never import the service-role client into middleware or client code.
- Missing admin variables produce a clear configuration error rather than arbitrary access.
- Customer authentication remains mock-only and phone-based. Show the demo OTP only in the mock login UI; accept only `12345`, issue a separate secure customer session, preserve validated same-origin redirects, and upsert the customer through the active provider.
- Add a protected Cloudinary signature endpoint. Sign constrained upload parameters server-side and never return `CLOUDINARY_API_SECRET`.
- Keep checkout payment fully mocked. Server-side order creation revalidates product data, calculates shipping/coupons from provider settings, marks the order with an explicit mock payment method/status, and returns a confirmation state.

## Admin Feature Surface

Port shared reference components into `src/components/admin`:

- Cream collapsible sidebar with reference navigation and rust active state.
- White header with dashboard title, View Site, administrator identity, and logout.
- Responsive content shell, cards, semantic tables, forms, buttons, filters, tabs, modals, previews, optimistic actions, confirmations, loading indicators, and empty/error states.

Implement all requested routes for dashboard metrics, category/product CRUD, orders and details, customers, subscribers, review moderation, inquiries, hero slides, Instagram, home banner/promo popup, home reviews, announcements, FAQs, shipping, coupons, and profile settings. Mutations are server-side, Zod-validated, authorized, and revalidate affected public/admin paths.

Source-specific HIJABISTAA sample content is not imported. Empty collections remain valid when Khadeeja-Empire has no equivalent content.

## Public Surface Connections

- Products and categories feed shop and collection pages.
- Hero slides, promo/banner settings, announcements, Instagram content, and testimonials feed the homepage.
- Newsletter and contact forms create subscribers and inquiries.
- Reviews appear on the smallest compatible product/home surface.
- Shipping and coupons participate in checkout.
- FAQs appear on the existing information surface or a minimal public FAQ section.

## Verification

Add focused tests for admin sessions, middleware redirects, provider selection/persistence, representative CRUD actions, OTP rules, Cloudinary response safety, storefront adapters, and public content. Run typecheck, unit tests, build, compatible linting, and Playwright checks for login protection, representative CRUD, admin chrome isolation, mock checkout confirmation, and order visibility. Review the final diff/status to ensure existing storefront changes/assets remain intact and secrets/runtime data are not committed.

No commit will be created.
