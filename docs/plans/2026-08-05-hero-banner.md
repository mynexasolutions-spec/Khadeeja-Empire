# Khadeeja Empire Hero Banner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Rebuild the homepage hero to match the Sakhe-style full-bleed, right-aligned editorial slideshow while using Khadeeja Empire's existing copy and supplied local slide images.

**Architecture:** Keep the existing `HeroCarousel` client component and typed `heroSlides` data model. Serve the supplied PNGs from `public/assets/slides`, render each slide as a full-bleed image in a horizontally translating track with a transparent content overlay, and animate slides without visible indicators or controls. Preserve reduced-motion and accessible carousel semantics.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, `next/image`, Vitest/Playwright-compatible browser checks.

---

### Task 1: Expose the supplied hero assets

**Files:**
- Create: `public/assets/slides/girl-1.png`
- Create: `public/assets/slides/girl-2.png`
- Create: `public/assets/slides/girl-3.png`
- Do not modify: `assets/slides/*`

**Step 1:** Copy the three supplied PNGs from `assets/slides` into `public/assets/slides` without changing their bytes or filenames.

**Step 2:** Confirm all three files exist and retain their expected dimensions.

### Task 2: Wire the existing hero copy to the supplied assets

**Files:**
- Modify: `src/content/catalog.ts:670-701`

**Step 1:** Change only the three `heroSlides[].image` values to `/assets/slides/girl-1.png`, `/assets/slides/girl-2.png`, and `/assets/slides/girl-3.png` in order.

**Step 2:** Preserve the current title, subtitle, CTA, collection, and destination values.

**Step 3:** Run `npm run typecheck`.

### Task 3: Implement the Sakhe-style hero composition

**Files:**
- Modify: `src/components/home/HeroCarousel.tsx`

**Step 1:** Keep the existing client component, slide state, reduced-motion media query, and timer cleanup.

**Step 2:** Render the hero as a full-bleed stage with approximately `70dvh` mobile height and `80vh` desktop height.

**Step 3:** Render slides as full-stage flex-track items using `next/image`, `fill`, responsive `sizes`, and `object-cover`.

**Step 4:** Use horizontal `translateX` transitions so the active slide is centered and adjacent slides sit off-canvas.

**Step 5:** Place the current collection label, title, subtitle, and CTA in a transparent middle-right overlay on desktop and centered overlay on mobile.

**Step 6:** Add a subtle readability treatment only if required by the supplied image backgrounds; do not introduce a visible card or unrelated global style changes.

**Step 7:** Remove the visible slide indicator/bar and do not add visible hero controls.

**Step 8:** Pause the timer while the hero is hovered or focused, restore it on leave/blur, and keep it disabled for reduced-motion users.

**Step 9:** Preserve meaningful alt text, `aria-roledescription="carousel"`, slide group labels, and hidden inactive slides.

### Task 4: Verify the implementation

**Files:**
- Review: `src/components/home/HeroCarousel.tsx`
- Review: `src/content/catalog.ts`
- Review: `public/assets/slides/*`

**Step 1:** Run `npm run typecheck`.

**Step 2:** Run `npm run lint`.

**Step 3:** Run `npm run build`.

**Step 4:** Run the app and inspect the homepage at 360px, 390px, 768px, 1024px, and 1440px.

**Step 5:** Confirm the first slide loads immediately, all three slides rotate automatically, the horizontal transition works, no slide bar/control is visible, all CTA destinations remain unchanged, and no hero image returns 404.

**Step 6:** Confirm reduced-motion users receive a stable first slide and keyboard focus does not cause the timer to continue advancing.
