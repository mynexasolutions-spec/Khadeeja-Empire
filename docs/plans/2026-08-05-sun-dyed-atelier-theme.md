# Sun-Dyed Atelier Homepage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Give the Khadeeja Empire homepage a distinctive turmeric-led artisan identity while leaving the existing brand logo, shared header, footer, inner pages, and their visual styling unchanged.

**Architecture:** Wrap the homepage in a scoped `home-theme` root so its palette and display type cannot leak into shop, product, cart, checkout, or other routes. Preserve the existing homepage component composition and carousel behavior, and add only lightweight homepage craft primitives plus transparent hero-image derivatives.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, `next/font`, `next/image`, Vitest.

---

## Scope Boundary

Change only the homepage composition in `src/app/page.tsx`, the components under `src/components/home/`, homepage content/assets, and scoped CSS needed by those components.

Do not redesign or edit the brand artwork at `public/assets/logo.png`.

Do not change the shared `Header`, `AnnouncementBar`, `Footer`, `StoreShell`, `BrandLogo`, shop pages, product pages, cart, checkout, search, contact, about, or shipping pages.

Do not replace global semantic color values. The new colors must be declared under `.home-theme` and inherited only by homepage descendants.

Preserve the existing uncommitted changes already present in the worktree. Do not stage the deleted `public/assets/logo.jpeg` or `public/assets/logo.jpg` as part of this feature.

## Design Rules

- Cotton paper: `#F6EFDF`
- Paper surface: `#FFFDF7`
- Turmeric: `#D5961B`
- Deep indigo: `#173B59`
- Indigo hover: `#102E46`
- Madder: `#A84734`
- Leaf: `#587348`
- Ink: `#1D2C30`
- Use indigo for text and controls on turmeric surfaces.
- Use turmeric for hero panels, accents, labels, and focus rings.
- Use madder and leaf sparingly as collection accents.
- Use Fraunces for homepage display text and retain DM Sans for interface text.
- Use one recurring carved-sun/seed motif and quiet stitch rules.
- Do not use generic paisley clip art, heavy gradients, or decorative patterns over product photography.

## Tasks

### Task 1: Add the Scoped Homepage Root

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/styles/globals.css`

Wrap the existing homepage sections in a `<main>` or `<div>` with `home-theme` and preserve the current section order:

`HeroCarousel -> BrandIntro -> CollectionGrid -> ProductRail -> CraftStory -> ValuesSection -> VideoStrip -> NewsletterSection`

Define the Sun-Dyed Atelier variables under `.home-theme`, not under `:root`. Override the homepage display heading font under `.home-theme` without changing the global display font used by other routes.

Verify that a non-home route still receives the existing global colors and typography.

### Task 2: Load Fraunces Only for the Homepage

**Files:**
- Modify: `src/app/page.tsx`

Load Fraunces in the server-rendered homepage module with a CSS variable such as `--font-home-display`. Apply the generated variable class to the `home-theme` wrapper.

Keep the existing global Cormorant Garamond configuration in `src/app/layout.tsx` unchanged so inner pages do not change.

### Task 3: Verify Homepage Hero Assets

**Files:**
- Review: `public/assets/slides/girl-1.png`
- Review: `public/assets/slides/girl-2.png`
- Review: `public/assets/slides/girl-3.png`
- Modify: `src/content/catalog.ts` only if an image path is incorrect

The supplied PNGs already contain alpha transparency and can be used directly. Preserve the original source images under `public/assets/slides/` and `assets/slides/`.

Keep the existing homepage hero image paths. Preserve slide titles, links, alt text, and carousel data structure.

Do not modify `public/assets/logo.png`.

Verify all three PNGs load through `next/image`, retain transparency, and do not show rectangular backgrounds in the hero.

### Task 4: Add the Homepage Craft Mark

**Files:**
- Create: `src/components/ui/CraftMark.tsx`
- Modify: `src/styles/globals.css`

Create a small presentational carved-sun/seed SVG component with `aria-hidden="true"`. Support a small set of tones: `indigo`, `turmeric`, `madder`, and `leaf`.

Add scoped `.stitch-rule`, `.paper-grain`, and `.craft-frame` styles. Keep the motif and grain low contrast and disable nonessential movement under `prefers-reduced-motion`.

### Task 5: Rebuild the Homepage Hero Skin

**Files:**
- Modify: `src/components/home/HeroCarousel.tsx`

Keep all existing carousel state and accessibility behavior:

- Six-second automatic rotation
- Hover and focus pause
- Manual pause button
- ArrowLeft and ArrowRight keyboard controls
- `aria-live` announcement
- Inactive slides marked `aria-hidden` and `inert`
- Reduced-motion support

Change only the visual composition:

- Left side: cotton-paper model area with transparent cutout.
- Right side: turmeric panel.
- Title: homepage Fraunces, uppercase, deep indigo.
- CTA: indigo rectangle with paper-colored text and `EXPLORE` label.
- Divider: subtle vertical stitch seam between image and text.
- Mobile: stack the image above the turmeric text panel.

Remove the current `mix-blend-multiply`, maroon-specific classes, and background-image scaling hacks once the transparent derivatives are available.

### Task 6: Restyle Homepage Content Sections

**Files:**
- Modify: `src/components/home/BrandIntro.tsx`
- Modify: `src/components/home/CollectionGrid.tsx`
- Modify: `src/components/home/ProductRail.tsx`
- Modify: `src/components/home/CraftStory.tsx`
- Modify: `src/components/home/ValuesSection.tsx`
- Modify: `src/components/home/VideoStrip.tsx`
- Modify: `src/components/home/NewsletterSection.tsx`

Apply the scoped palette and typography without changing business content or links.

Use these section treatments:

- BrandIntro: indigo Fraunces statement, turmeric eyebrow, and CraftMark.
- CollectionGrid: one accent rule or label per collection; keep product imagery dominant.
- ProductRail: paper cards, indigo product links, restrained stitch hover frame.
- CraftStory: indigo or madder editorial block with turmeric stitch detail.
- ValuesSection: indigo surface, paper text, turmeric craft markers.
- VideoStrip: minimal craft frame around existing photography and video.
- NewsletterSection: turmeric band with indigo text and form controls.

Do not modify shared `SectionHeading`, `Button`, `ProductCard`, or layout components unless a homepage-only class can be added without changing their appearance on other routes.

### Task 7: Add Homepage Behavior Tests

**Files:**
- Create: `src/components/home/home-theme.test.tsx`

Test the homepage composition and behavior at the component boundary:

- All eight homepage sections render in the expected order.
- Hero slide titles and `EXPLORE` links render.
- Existing announcement/header/logo components are not imported into the homepage theme wrapper.

Run `npm test src/components/home/home-theme.test.tsx` and confirm the test fails before adding the new assertions' implementation dependencies.

### Task 8: Verify the Scoped Change

Run:

`npm run typecheck`

`npm run lint`

`npm test`

`npm run build`

Run the dev server and inspect the homepage at 1440px, 1024px, 768px, 390px, and 360px.

Confirm:

- The existing logo is visually unchanged.
- Header, announcement bar, and footer remain unchanged.
- Inner routes retain their existing styling.
- The homepage uses the turmeric/indigo artisan theme.
- Hero cutouts have no rectangular backgrounds.
- Keyboard and reduced-motion carousel behavior still works.
- No horizontal overflow appears on mobile.
- Focus indicators and text contrast remain usable.

Use `git diff --check` and review the final diff before staging. Do not commit unless explicitly requested.
