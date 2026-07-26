# Premium UI Redesign — Tiga Anak Propertindo

**Date:** 2026-07-26
**Status:** Approved (all 5 sections approved by user during brainstorm)
**Scope:** All public pages. Admin panel, API routes, DB schema, auth logic, UploadThing — NOT touched.

## Problem

The UI looks generic despite partial premium touches (Cormorant headlines, hero animations). Root causes:

1. **Broken font wiring** — `--font-sans: var(--font-sans)` self-reference in `@theme`; Geist (generic Vercel default) renders as body; `--font-geist-mono` referenced but never loaded.
2. **Cold neutrals** — all gray tokens are `chroma 0` (pure gray), clashing with the warm brown brand.
3. **Off-brand accents** — navy hero overlays (`rgba(16,22,38)`), `sky-500` "Disewa" badge.
4. **Emoji icons** (🏠🏢🌿🏪) for property types — undermines premium positioning.
5. **Legacy token mess** — `--text-dark`, `--primary-brown`, `--white-80`, `--hero-overlay-*` duplicate shadcn tokens in mixed hex/rgba/oklch.
6. **Stock-shadcn pages** — catalog & detail pages use default components with sans headings.
7. **Barebones footer**, favicon-as-logo, generic gray shadows.

## Design Direction

**Warm Luxury / Resort** — evolution of the existing brown identity: warm neutrals (ivory, taupe), bronze/amber accent, large editorial serif, photo-dominant. Reference feel: Aman resorts, architecture magazines, premium Indonesian developers. Motion: subtle & refined (scroll-reveal, micro-interactions, no heavy libraries).

## Section 1 — Foundation (Design Tokens)

### Color (all oklch, warm-tinted)

| Token | Light | Dark |
|---|---|---|
| Background | `oklch(0.98 0.005 85)` warm ivory | `oklch(0.17 0.008 60)` warm espresso |
| Foreground | `oklch(0.26 0.012 55)` warm near-black | ivory |
| Primary (bronze) | `oklch(0.50 0.115 52)` | `oklch(0.66 0.11 60)` |
| Gold accent (hairlines, highlights) | `oklch(0.72 0.09 78)` champagne | same |
| Badge "Disewa" | dark glass pill (espresso/70 + blur, ivory text) | same |
| Hero overlay | warm espresso gradient | — |

- All neutral scales regenerated with small chroma (0.004–0.015, hue 55–85) so grays are warm.
- Legacy vars (`--text-dark`, `--text-gray`, `--primary-brown`, `--white-80/50/86`, `--hero-overlay-*`, `--shadow-light`) **deleted**; all usages migrated to standard shadcn tokens.
- Existing custom `brown` oklch scale regenerated around the new bronze hue.

### Typography (next/font/google, fix wiring)

- **Display: Fraunces** (variable, optical sizing, incl. italic) → `--font-display`.
- **Body: Jost** → `--font-sans`.
- Remove Geist, remove phantom `--font-geist-mono`, fix `--font-sans` self-reference.
- `.font-display` utility points to Fraunces.

### Details

- `--radius: 0.875rem` (cards → softer `rounded-2xl/3xl`).
- Shadows warm-tinted (brown tint, low opacity) instead of gray.
- Grain overlay kept at lower opacity; gold gradient hairline = recurring section-divider motif.

### Motion primitive

- `Reveal` — lightweight client component (IntersectionObserver + CSS): fade + rise 16px, stagger via `delay` prop. No new libraries.

## Section 2 — Shared Components

### Navbar
- Sticky + blur kept; `bg-background/80`; gold hairline appears below after scroll > 24px.
- Logo: inline-SVG monogram "TA" in rounded bronze square + Fraunces italic wordmark (replaces favicon PNG).
- Nav links: uppercase 11px wide tracking kept; active state = gold dot + bronze text; smoother underline animation.
- "Masuk" button: bronze outline with soft fill on hover.

### Footer (total rebuild)
Always-dark espresso panel (both themes), ivory text, 4 columns:
1. Brand — logomark, wordmark, tagline, social icons (Instagram/WhatsApp/Mail, lucide).
2. Jelajahi — catalog links per type (Rumah, Apartemen, Tanah, Ruko).
3. Perusahaan — Tentang, Hubungi Kami, Kebijakan Privasi (`#` links until pages exist).
4. Kontak — address/email/phone from `lib/brand.ts`.
Bottom bar: gold hairline + copyright. No emoji.

### PropertyCard (most important component)
- Image `h-56`, hover `scale-105` (calmer), warm espresso overlay gradient.
- Badges: "Dijual" = solid bronze; "Disewa" = dark glass pill. Type pill kept (glass).
- Price: Fraunces large with small "Rp" prefix (luxury price-tag style).
- Title: Fraunces medium, `line-clamp-1`.
- Spec row (KT/KM/m²): lucide icons, separated by thin vertical hairlines, no heavy `border-t`.
- Hover: `-translate-y-1` + large warm shadow + gold hairline appears at card top.
- Favorite heart (where applicable): glass pill top-right on image, bronze when active.

### New small primitives
- `SectionHeading` — eyebrow (uppercase wide tracking + small gold line) + Fraunces title + optional subtitle. Reused across all sections/pages.
- `Reveal` — from Section 1.
- shadcn `badge/button/card/input/select` re-themed automatically via new tokens (no per-file edits needed).

## Section 3 — Homepage

1. **Hero (refine, not rebuild)**
   - Navy overlay → warm espresso gradient (darker top for nav readability, fading into page bg).
   - Fraunces headline with bronze italic middle line (kept) + existing staggered entrance.
   - Search bar: white box → ivory glass (`bg-ivory/90 backdrop-blur`, gold hairline top), warm-themed inputs, vertical divider between fields.
   - Type pills: emoji removed → lucide icons (Home, Building2, TreePalm, Store) + small uppercase labels; glass pills kept.
   - Stats: Fraunces numerals + small uppercase labels, ivory/20 vertical hairline dividers.
   - SVG wave below hero → clean straight transition + gold hairline.
   - Grain kept, lower opacity.
2. **ExploreTypes (redesign)** — editorial cards: warm taupe background, large lucide icon in bronze-hint circle, Fraunces type name, small uppercase listing count; hover: bronze background + ivory text + arrow appears.
3. **"Properti Terbaru"** — `SectionHeading` (eyebrow "Pilihan Terbaru") + "Lihat Semua" link with arrow that shifts on hover; 3-col new PropertyCards with `Reveal` stagger.
4. **PopularCities** — `h-52` cards, warm espresso overlay, Fraunces italic city name + small uppercase property count, hover scale-105; light bento layout (2 large + 4 small) instead of 6 equal boxes.
5. **TrustSection** — cards removed; 3 bare columns on ivory, icons in thin gold-ring circles, Fraunces titles, vertical hairline separators (desktop).
6. **New CTA banner** — full-width espresso section before footer: Fraunces headline + bronze button + property photo bg with overlay.

## Section 4 — Catalog, Detail, Map

### `/properti` (Catalog)
- Header: `SectionHeading` + styled result count (Fraunces italic bronze numerals).
- Filter sidebar: borderless panel on warm taupe (`bg-secondary/60`), `rounded-3xl`, uppercase 11px labels, re-themed Selects/Inputs (rounded-xl, warm borders, bronze focus ring), ghost "Reset" button.
- Mobile Sheet: Fraunces title + full-width bronze apply button.
- Grid: new PropertyCards; skeletons use warm-tinted shimmer.
- Empty state: SearchX in gold-hint circle + Fraunces text + reset button.

### `/properti/[id]` (Detail)
- Gallery: `rounded-2xl`, wider gaps, primary image `h-[420px]`; lightbox kept, backdrop → warm espresso/95.
- Title block: price first — "Rp x M" large Fraunces bronze, then Fraunces 3xl title, address with small MapPin; pills consistent with PropertyCard.
- Specs (KT/KM/LB/LT): 4-column strip separated by vertical hairlines, large Fraunces numerals + small uppercase labels.
- Description: warm `leading-relaxed` prose; small Fraunces section headings ("Tentang Properti Ini", "Lokasi"). No drop-cap.
- AgentCard: warm taupe `rounded-3xl` panel, larger avatar with thin gold ring, Fraunces name, bronze solid WhatsApp button (on-brand, not WA green) + secondary "Simpan" (heart).
- Map: Leaflet kept, `rounded-2xl` container + warm border; ghost "Buka di Google Maps".

### `/peta`
- Retheme only: warm-styled marker popups (Fraunces title, bronze price, bronze button).

## Section 5 — Auth, Profile, Technical Plan

### `/masuk` & `/daftar`
- Split-screen: left = full-height property photo with warm espresso overlay + Fraunces italic quote/headline + logomark; right = form on ivory. Mobile: photo becomes thin top banner.
- Forms: small uppercase labels, warm rounded-xl inputs, full-width bronze submit with existing `btn-press`, warm destructive errors, bronze underline-offset cross-links.

### `/profil`
- Header: large avatar + Fraunces name + muted email + bronze role pill.
- Favorites tab: new PropertyCard grid; empty state: heart in gold-hint circle + "Jelajahi Properti" CTA.

### Technical plan

**Execution order (5 stages, each must pass `pnpm lint` → `pnpm exec tsc --noEmit` → `pnpm test` → `pnpm build`):**

1. **Foundation** — `globals.css` token rewrite + legacy cleanup, `layout.tsx` font swap (Fraunces + Jost), wiring fixes.
2. **Primitives & shared** — `Reveal`, `SectionHeading`, Navbar, Footer, PropertyCard + legacy-token migration.
3. **Homepage** — hero refine, ExploreTypes, cities bento, Trust, CTA banner.
4. **Catalog + Detail + Map.**
5. **Auth + Profile** + final polish (favicon monogram).

**Error handling:** no new logic — purely presentational; existing error surfaces (sonner toasts, empty states) only re-themed.

**Testing:** existing Jest tests must stay green (no behavior changes); add/update tests only if component structure changes significantly (e.g. PropertyCard). Manual visual verification via `pnpm dev` per stage, including dark mode.

**Dark mode:** every color decision has a dark counterpart (Section 1); checked per stage.

**Out of scope:** `/admin/*`, API routes, DB schema, auth logic, UploadThing, og-image.
