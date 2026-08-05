# Admin Dashboard Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the complete reference admin dashboard into Khadeeja-Empire with full provider-backed storefront data, secure admin/customer flows, mock checkout, and no loss of current storefront work.

**Architecture:** Make Supabase or a server-only local JSON store the authoritative data provider for both admin and storefront reads. Keep current public URLs and component-facing product types through explicit adapters, isolate the storefront and admin route shells with route groups, and enforce server-side authorization on middleware, layouts, actions, and route handlers.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Zod, `@supabase/ssr`, `@supabase/supabase-js`, `jose`, Cloudinary Node SDK, Vitest, Playwright.

---

## Execution Rules

- Never overwrite or revert existing modified/untracked storefront files.
- Use `Glob`, `Grep`, and `Read` for repository inspection; use `apply_patch` for manual edits.
- Use Context7 documentation before relying on current Next.js, Supabase SSR, or Cloudinary APIs.
- Use `server-only` boundaries for service-role, local filesystem, admin auth secrets, and Cloudinary secrets.
- Do not read, print, stage, or commit `.env`.
- Do not commit any changes. Runtime local data belongs under ignored `.data/`.
- Run targeted tests after each workstream and full verification at the end.
- Agents must edit only the file ownership listed in their task. Report changed paths and verification results; do not make unrelated cleanup changes.

## Dependency Graph and Agent Ownership

1. Foundation: route isolation, dependencies, types, schemas, provider contracts.
2. Persistence: local provider, Supabase provider/schema, and seed data.
3. Security: admin sessions, middleware, customer sessions, Cloudinary signing.
4. Admin UI: shell and feature routes, using the completed contracts/security boundaries.
5. Storefront integration: provider-backed reads, public content, customer login, checkout/orders.
6. Verification: tests, browser checks, build, and final diff review.

Parallel work is allowed only for tasks with disjoint file ownership. Admin UI and storefront integration may run in parallel after provider contracts exist; they must not edit each other's files or shared root config.

### Task 1: Baseline and route shell isolation

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(storefront)/layout.tsx`
- Move without content changes: existing public route directories currently under `src/app/` into `src/app/(storefront)/`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx` placeholder
- Create: `src/app/admin/(protected)/layout.tsx` placeholder
- Modify: `src/styles/globals.css` only with scoped admin layer placeholder
- Modify: `.gitignore`

**Steps:**

1. Record `git status --short` and identify the current storefront files before changing anything.
2. Move public routes into the route group using file moves that preserve content and URL paths. Do not touch the modified storefront implementations beyond path relocation.
3. Keep document metadata/fonts in the root layout and render `StoreShell` only in the storefront layout.
4. Add the admin layout boundaries without implementing auth yet.
5. Add `.data/` to `.gitignore`; do not add the runtime JSON file to git.
6. Run `npm run typecheck` and the existing tests. Expected: existing storefront routes still typecheck and tests pass.

### Task 2: Dependencies and environment contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `next.config.ts`

**Steps:**

1. Add only required runtime packages: `@supabase/ssr`, `@supabase/supabase-js`, `jose`, and `cloudinary`.
2. Install using the repository's existing package manager and preserve existing dependency versions/configuration.
3. Document variable names without values: admin, Supabase, Cloudinary, and public app settings.
4. Add Cloudinary `remotePatterns` only for configured Cloudinary URLs; do not expose API secrets or read `.env` into config output.
5. Run `npm install`, `npm run typecheck`, and `npm test`.

### Task 3: Domain types, validation, and repository contracts

**Files:**
- Create: `src/lib/admin/types.ts`
- Create: `src/lib/admin/schemas.ts`
- Create: `src/lib/admin/errors.ts`
- Create: `src/lib/data/provider.ts`
- Create: `src/lib/data/index.ts`
- Create: `src/lib/storefront/adapters.ts`
- Test: `src/lib/admin/schemas.test.ts`

**Steps:**

1. Define serializable DTOs for all required entities and settings, including nullable/optional fields tolerated by the local seed.
2. Define `DataProvider` read/mutation methods for dashboard metrics, catalog, orders, customers, subscribers, reviews, inquiries, hero slides, Instagram posts, testimonials, FAQs, announcements, coupons, shipping, promo settings, and profile.
3. Define Zod schemas for every mutation input; reject invalid IDs, URLs, ranges, duplicate-sensitive fields, and unsafe redirects.
4. Define typed `ConfigurationError`, `DataProviderError`, `NotFoundError`, and `AuthorizationError` with safe user-facing messages.
5. Implement adapters from provider products/categories to the existing `src/types/index.ts` storefront shape without changing existing consumers.
6. Write failing schema/adapter tests, run `npm test -- src/lib/admin/schemas.test.ts`, implement, then rerun until passing.

### Task 4: Local JSON provider and current-content seed

**Files:**
- Create: `src/lib/data/local-store.ts`
- Create: `src/lib/data/local-provider.ts`
- Create: `src/lib/data/seed.ts`
- Create: `src/lib/data/runtime.ts`
- Create: `data/README.md`
- Modify: `.gitignore`
- Test: `src/lib/data/local-provider.test.ts`

**Steps:**

1. Build a server-only store at `process.cwd()/.data/khadeeja-admin.json`, initialized from seed data when absent.
2. Read and validate JSON with Zod; write updates through a temporary file followed by atomic rename.
3. Keep a small in-process write queue to avoid overlapping writes during local development.
4. Seed products, categories, collections, hero slides, Instagram content, and media paths from current `src/content` modules; initialize other collections empty and settings with safe defaults.
5. Implement every `DataProvider` method with tolerant optional fields and clear not-found/duplicate errors.
6. Test persistence across provider instances, empty collections, CRUD, toggles, ordering, and invalid JSON. Runtime file must never be served publicly.

### Task 5: Supabase provider, schema, and seed instructions

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/service-role.ts`
- Create: `src/lib/data/supabase-provider.ts`
- Create: `src/lib/data/config.ts`
- Create: `database/schema.sql`
- Create: `database/seed.sql`
- Create: `database/README.md`
- Test: `src/lib/data/provider-selection.test.ts`

**Steps:**

1. Implement all-or-nothing Supabase configuration detection and placeholder detection. Partial supplied configuration returns a configuration error.
2. Implement the current `@supabase/ssr` cookie `getAll`/`setAll` server client. Keep the service-role client in a `server-only` module and set `autoRefreshToken`, `persistSession: false`, and `detectSessionInUrl: false` for server admin use.
3. Map every provider method to normalized tables and translate database errors into safe `DataProviderError` messages.
4. Add schema tables and indexes for profiles, customers, categories, products, product colors, product variants, product images, product information, addresses, orders, order items, reviews, inquiries, hero slides, coupons, announcements, settings, subscribers, Instagram posts, testimonials, global FAQs, and discovery menu entries.
5. Add constraints, timestamps, useful indexes, and RLS policies. Document service-role usage for protected admin operations; do not perform remote migrations automatically.
6. Seed only current Khadeeja-Empire data and demo settings. Document the exact Supabase SQL execution steps.
7. Test provider selection without logging key values and verify that configured Supabase errors are not converted to local mode.

### Task 6: Admin session, middleware, and protected layouts

**Files:**
- Create: `src/lib/auth/admin-session.ts`
- Create: `src/lib/auth/config.ts`
- Create: `src/middleware.ts`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Create: `src/app/admin/loading.tsx`
- Create: `src/app/admin/error.tsx`
- Test: `src/lib/auth/admin-session.test.ts`

**Steps:**

1. Implement signed admin session creation and verification with `jose`, including issuer, audience, role, expiry, and a minimal email claim.
2. Fail clearly when `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` is missing; compare credentials only inside the server login action/route.
3. Configure cookie flags exactly: `httpOnly`, `sameSite: 'lax'`, `secure: process.env.NODE_ENV === 'production'`, `path: '/'`, and bounded expiry.
4. Protect `/admin/*` except `/admin/login` and protect admin API endpoints. Redirect only to safe fixed paths or validated same-origin `next` values.
5. Add optional Supabase SSR session refresh in middleware without importing service-role or Node-only modules into middleware.
6. Validate admin session again in the protected layout and expose only safe admin identity data to the header.
7. Test valid/invalid signatures, expiry, missing configuration, login exception, secure cookie flags, and redirect behavior.

### Task 7: Cloudinary signing and upload fallback

**Files:**
- Create: `src/lib/cloudinary/signature.ts`
- Create: `src/app/api/admin/media/signature/route.ts`
- Create: `src/components/admin/MediaUpload.tsx`
- Test: `src/lib/cloudinary/signature.test.ts`

**Steps:**

1. Require an authenticated admin session in the signature route.
2. Accept only validated upload folder/resource type/format/size parameters and create a short-lived signed payload with the Cloudinary API secret on the server.
3. Return cloud name, API key, timestamp, folder, and signature only. Never return the API secret or arbitrary user-supplied signing parameters.
4. Implement the admin upload component to use signed direct upload when configured and accept `/assets/...` or other existing local asset URLs when not configured.
5. Test the response shape and assert the secret is absent from JSON, client bundles, and logs.

### Task 8: Admin shell and shared UI primitives

**Files:**
- Create: `src/components/admin/AdminShell.tsx`
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/Header.tsx`
- Create: `src/components/admin/AdminNav.ts`
- Create: `src/components/admin/AdminUI.tsx`
- Create: `src/styles/admin.css`
- Modify: `src/app/admin/layout.tsx`

**Steps:**

1. Port the reference cream/ink/rust visual tokens into scoped admin CSS/Tailwind classes without changing storefront tokens.
2. Implement the collapsible desktop sidebar and mobile-safe navigation using semantic links and visible keyboard focus.
3. Implement the white header with View Site, administrator identity, and logout form/action.
4. Add shared page title, card, table, status badge, empty state, error state, spinner, confirmation, and form field primitives.
5. Verify at narrow and desktop widths with browser snapshots; preserve accessible names and table semantics.

### Task 9: Admin authentication route and login UI

**Files:**
- Create: `src/app/admin/login/actions.ts`
- Modify: `src/app/admin/login/page.tsx`
- Create: `src/app/api/admin/logout/route.ts`
- Test: `src/app/admin/login/login.test.ts`

**Steps:**

1. Add a server action or route handler that validates email/password using environment values and creates the signed cookie.
2. Add the reference centered cream login card, shield branding adapted to Khadeeja-Empire, password visibility control, inline errors, and pending spinner.
3. Redirect only to `/admin` or a validated same-origin admin path.
4. Add logout cookie clearing and redirect to `/admin/login`.
5. Test invalid credentials, valid credentials with configured env, missing env error, cookie flags, and logout.

### Task 10: Dashboard, catalog, and category/product administration

**Files:**
- Create/modify: `src/app/admin/(protected)/page.tsx`
- Create/modify: `src/app/admin/(protected)/categories/**`
- Create/modify: `src/app/admin/(protected)/products/**`
- Create: `src/actions/admin/catalog.ts`
- Create: `src/actions/admin/categories.ts`
- Create: `src/actions/admin/products.ts`
- Create: `src/components/admin/catalog/**`
- Test: `src/actions/admin/catalog.test.ts`

**Steps:**

1. Render dashboard KPI cards and recent orders using provider metrics with safe currency/date formatting and loading/empty states.
2. Implement category list/new/edit with image, description, parent, active state, discovery menu controls, counts, delete, and status toggle.
3. Implement product list/new/edit with name, slug, category, price/old price, badge, short/full descriptions, SEO, active/featured flags, sizes, colors, variants, stock, images, FAQs, and missing-media warnings.
4. Validate all form data server-side and derive slugs server-side; never trust client-provided category/product relationships.
5. Use `revalidatePath` for affected admin and storefront pages after successful mutations.
6. Preserve reference tables, buttons, optimistic pending states, confirmation dialogs, and empty states.
7. Test create/update/delete/toggle operations in both provider modes through action-level tests.

### Task 11: Orders, customers, subscribers, reviews, and inquiries

**Files:**
- Create/modify: `src/app/admin/(protected)/orders/**`
- Create/modify: `src/app/admin/(protected)/customers/**`
- Create/modify: `src/app/admin/(protected)/subscribers/**`
- Create/modify: `src/app/admin/(protected)/reviews/**`
- Create/modify: `src/app/admin/(protected)/inquiries/**`
- Create: `src/actions/admin/orders.ts`
- Create: `src/actions/admin/customers.ts`
- Create: `src/actions/admin/subscribers.ts`
- Create: `src/actions/admin/reviews.ts`
- Create: `src/actions/admin/inquiries.ts`
- Create: `src/components/admin/operations/**`

**Steps:**

1. Implement reference-style searchable/filterable order list and detail views with customer, address, items, payment/status, timeline, status updates, deletion where supported, and clear empty states.
2. Implement customer stats/search/status toggles and customer detail data without exposing secrets.
3. Implement subscriber search, add/delete, copy/mail links, CSV export, and empty/search states.
4. Implement product review moderation and home-review tabs with approve/delete/add behavior.
5. Implement expandable inquiries with unread/read status, reply mailto, delete, and safe message rendering.
6. Ensure every mutation validates the admin session inside its server action and revalidates lists/details.
7. Add action and component tests for status transitions, optimistic rollback paths, duplicate subscribers, and missing records.

### Task 12: Homepage and settings administration

**Files:**
- Create/modify: `src/app/admin/(protected)/hero-slides/**`
- Create/modify: `src/app/admin/(protected)/instagram/**`
- Create/modify: `src/app/admin/(protected)/home-banner/**`
- Create/modify: `src/app/admin/(protected)/home-reviews/**`
- Create/modify: `src/app/admin/(protected)/announcements/**`
- Create/modify: `src/app/admin/(protected)/settings/**`
- Create: `src/actions/admin/content.ts`
- Create: `src/actions/admin/settings.ts`
- Create: `src/components/admin/content/**`

**Steps:**

1. Implement hero text/slide management with preview, active toggle, max slide validation, upload/local URL support, delete, and processing state.
2. Implement Instagram grid/modal CRUD, active/order controls, link handling, and empty state.
3. Implement home promo popup/banner settings with enabled state, frequency, max views, copy, coupon sync, timer, image, CTA, and preview.
4. Implement homepage reviews/testimonials, announcements with active/reorder/settings controls, and reference live preview behavior.
5. Implement FAQs, shipping rates/thresholds/COD/discount, coupons, and admin profile settings with inline success/error states.
6. Use provider settings JSON only where schema flexibility is intentional; keep relational data in tables.
7. Test settings validation, ordering, toggle persistence, duplicate coupon behavior, and public revalidation.

### Task 13: Storefront provider migration and public content connections

**Files:**
- Modify: `src/app/(storefront)/**` pages that currently import static catalog/category/content
- Modify: `src/components/home/**`
- Modify: `src/components/layout/AnnouncementBar.tsx`
- Modify: `src/components/layout/NewsletterForm.tsx`
- Modify: `src/components/layout/ContactForm.tsx`
- Modify: `src/components/product/**`
- Modify: `src/content/**` only where exports need to become seed-compatible
- Create: `src/lib/storefront/queries.ts`
- Create: `src/components/home/PublicReviews.tsx` if no compatible surface exists
- Create: `src/app/(storefront)/faqs/page.tsx` only if required after audit

**Steps:**

1. Replace direct runtime catalog imports with server provider queries and adapter output while retaining the current component props and URLs.
2. Update shop, collection, product, search, homepage rails, hero, Instagram, announcements, and review surfaces to use provider-backed content.
3. Preserve current static content as seed and ensure missing optional provider fields do not break rendering.
4. Make newsletter and contact forms call server mutations that create subscribers/inquiries and show clear pending/success/error states.
5. Add only the smallest missing public FAQ/review surface required for admin-managed data to be useful.
6. Verify current product/collection slugs, media paths, homepage theme, cart drawer, header, footer, and mobile navigation remain unchanged for public routes.

### Task 14: Customer phone OTP and mock checkout/order creation

**Files:**
- Create: `src/lib/auth/customer-session.ts`
- Create: `src/lib/auth/mock-otp.ts`
- Create: `src/app/(storefront)/login/page.tsx` or the existing customer login route after audit
- Create: `src/app/api/customer/otp/request/route.ts`
- Create: `src/app/api/customer/otp/verify/route.ts`
- Create: `src/app/api/orders/route.ts`
- Modify: `src/components/cart/CheckoutForm.tsx`
- Modify: `src/app/(storefront)/checkout/page.tsx`
- Create: `src/lib/orders/pricing.ts`
- Test: `src/lib/orders/pricing.test.ts`

**Steps:**

1. Implement server-side mock OTP state with TTL, attempt limit, and cooldown. The UI displays only the fixed demo code `12345`; never log it.
2. Issue a separate secure customer session after verification and preserve safe checkout redirects.
3. Define a checkout DTO containing product IDs/slugs, sizes, quantities, shipping data, coupon code, and idempotency key; do not trust client prices or full product objects.
4. Recalculate product prices/availability from the active provider, apply shipping and coupon settings, create a demo order, and mark mock payment success explicitly.
5. Update checkout to call the server endpoint, clear local cart only after success, and show a clear confirmation/order reference.
6. Ensure created orders appear in admin dashboard/list/detail reads in both provider modes.
7. Test invalid OTPs, valid OTP, redirects, tampered prices, unavailable products, coupons, shipping thresholds, duplicate idempotency keys, and confirmation state.

### Task 15: Verification and integration review

**Files:**
- Create/modify: `tests/e2e/admin.spec.ts`
- Create/modify: `tests/e2e/checkout.spec.ts`
- Create: `src/lib/admin/verification.test.ts`
- Modify: `playwright.config.ts` only if required by existing setup

**Steps:**

1. Run `npm run typecheck` and fix only errors introduced by the integration.
2. Run `npm test` and verify all existing storefront tests plus new unit/action tests pass.
3. Run `npm run lint` if compatible; record pre-existing incompatibilities separately.
4. Run `npm run build` with safe placeholder/local-mode environment values and verify no server-only imports enter client bundles.
5. Start the app using the repository's existing dev command and run Playwright checks for unauthenticated redirect, invalid/valid admin login, representative admin routes without storefront chrome, product/category mutation, mock checkout confirmation, and order visibility.
6. Use browser snapshots at desktop and mobile widths to verify sidebar/header/forms/tables/empty/loading states and keyboard focus.
7. Inspect `git diff --stat`, `git diff --name-status`, and `git status --short`. Confirm no existing assets or uncommitted storefront changes were deleted/overwritten, `.env` is not included, and runtime `.data` is ignored.
8. Do not commit changes. Report remaining setup steps for Supabase schema/seed and environment variables.
