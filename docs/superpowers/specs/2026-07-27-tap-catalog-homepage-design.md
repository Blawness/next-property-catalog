# TAP CATALOG — Homepage Redesign (Reference-Driven)

**Date:** 2026-07-27 (initial), revised 2026-07-27 (mockup HTML alignment)
**Status:** Approved (initial spec). Homepage section revised after user provided authoritative HTML mockup.
**Reference:** `references/web tap catalog.svg` (wireframe) + `references/SVG ke HTML mockup Next.js.zip` (HTML mockup — **authoritative**)
**Supersedes:** `2026-07-26-premium-ui-redesign-design.md` (the "Warm Luxury / Resort" direction is abandoned)

**Revision notes (2026-07-27):** User provided an HTML mockup of the SVG that exposes specific design tokens the SVG alone couldn't reveal:
- **Font is `Mulish`** (not Poppins) — confirmed by `@import` in the mockup HTML
- **Accent brown is `#723511`** (not oklch saddle brown) — the actual hex
- **Hero overlay is WHITE-to-transparent** (not dark) — headline sits on white, photo shows in lower 2/3
- **"Contact" word uses `paint-order: stroke fill`** — critical trick for the white-fill-on-brown-panel effect
- **Fixed dimensions in mockup** (1366px width, 114px header, 654px hero, etc.) — we mirror proportions but stay responsive
- **Outline-only cards** with very specific padding (73px top, 28px sides) — no fill, no shadow
- **Stats are font-weight 300 LIGHT** (not bold) at 120px
- **Nav is plain text, no icons**, 21px font, 58px gap

This revision captures those corrections. Other sections (tokens, primitives, auth, profile) are unchanged — they were already on the right path.

## Problem

The existing premium UI plan (bronze/gold, Fraunces serif, dark mode, editorial bento) does not match the new visual direction provided by the user. The user supplied a hand-crafted SVG wireframe (`web tap catalog.svg`) under the brand **TAP CATALOG** with a distinctly different aesthetic: bold saddle brown, black accent, sans-serif typography, flat layouts, outlined display type, light-only. We need a fresh spec that re-aligns all public pages to this reference.

## Design Direction

**Bold Catalog / Real Estate Agency** — direct, high-contrast, easy to scan. Reference feel: real estate broker microsite (clean type, big stats, 4-step "How We Work" trust builder, contact form closer). Voice: confident, informative, B2C residential.

## Brand Decision

- `BRAND.name`: **"TAP CATALOG"** (replaces "Tiga Anak Propertindo"). All page titles, metadata, footer copyright, OpenGraph, sitemap updated.
- `BRAND.fullName`: "TAP CATALOG — Katalog Properti Indonesia"
- `BRAND.tagline`: "Katalog Properti #1 Indonesia"
- `BRAND.headline`: kept as `["Temukan", "Properti", "Impianmu"]` — used in marketing copy / page description / 404 fallback. The Hero section uses the **English reference text** ("Discover Your Mission / Build Our Passion") as a faithful homage to the wireframe, so `BRAND.headline` is NOT rendered on the homepage.
- Logo: per HTML mockup — **raster logo image** `uploads/logo web tap catalog.png` (154×48px) at the header. SVG version at `uploads/tap catalog logo.svg` also available. Keep current `BrandMark` component as an alternative for places that need React (e.g. email) but the public site header/footer should use the actual logo asset.

---

## Section 1 — Foundation (Design Tokens)

### Color (light only — dark mode dropped)

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.99 0.005 80)` | warm off-white page bg |
| `--foreground` | `oklch(0.18 0.005 60)` | near-black body text |
| `--primary` | `#723511` (hex) | **saddle/sienna brown** — CTAs, borders, outlined type. Matches mockup HTML's `--accent: #723511` |
| `--primary-foreground` | `oklch(0.99 0.005 80)` | white text on brown |
| `--secondary` | `oklch(0.95 0.008 70)` | warm panels (filter sidebar, agent card) |
| `--secondary-foreground` | `oklch(0.18 0.005 60)` | |
| `--muted` | `oklch(0.95 0.005 75)` | |
| `--muted-foreground` | `oklch(0.45 0.008 60)` | secondary text |
| `--accent` | `oklch(0.18 0.005 60)` | **black** — How-We-Work icons, dividers |
| `--accent-foreground` | `oklch(0.99 0.005 80)` | |
| `--border` | `oklch(0.88 0.008 70)` | 1px lines |
| `--input` | `oklch(0.94 0.008 70)` | input bg |
| `--ring` | `oklch(0.45 0.12 40)` | focus ring |
| `--destructive` | `oklch(0.55 0.20 25)` | error states |
| `--radius` | `0.875rem` | cards → rounded-2xl/3xl |
| `--gold` (kept) | `oklch(0.72 0.09 78)` | hairline accent only (footer divider, card top). Not a primary brand color. |
| `--espresso` (removed) | — | no longer used anywhere. Footer uses `--primary` (saddle brown) instead. |

**Removed tokens:** `--hero-overlay-dark/medium/light`, `brown-*` scale, `gold-light`, `shadow-luxe`, `shadow-luxe-sm`, `--espresso`.

**Removed entirely:** `.dark { }` block, all `--color-*` references to brown/gold/espresso. shadcn tokens stay (sidebar, chart) but re-valued to neutral warm grays.

### Typography (next/font/google) — REVISED per HTML mockup

- **All text (display + body + nav):** `Mulish` (variable, weights 300/400/500/600/700/800 + italic 300/700) → `--font-mulish`
- **Removed:** Poppins + Manrope from initial spec
- Mulish is what the mockup HTML imports via Google Fonts: `Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,700&display=swap`
- All `.font-display` references resolve to Mulish.

### Drop dark mode (no toggling)

- Remove `next-themes` `ThemeProvider` from `components/Providers.tsx` (or keep wrapping but force `defaultTheme="light"` and `enableSystem={false}` — no toggle button).
- Delete `components/ThemeToggle.tsx` and its import from `components/Navbar.tsx`.
- Remove every `dark:` Tailwind variant from the codebase (~30+ occurrences, mostly in PropertyCard, Navbar, Footer, HeroSection, globals.css).
- Delete `<html ... className={...} suppressHydrationWarning>` dark-mode hookups in `app/layout.tsx` (revert to plain `<html lang="id">`).

### Details

- `--radius: 0.875rem` — cards use `rounded-2xl`, hero cards `rounded-3xl`.
- Gold hairline = recurring section-divider motif (4-6% opacity).
- Grain overlay (existing `.hero-grain`) lowered further or removed in favor of clean white.
- Reveal primitive: ease tuned to `cubic-bezier(0.22,1,0.36,1)`, 350ms (slightly faster than the bronze plan's 700ms).

### Motion primitive

- `Reveal` — kept from previous plan. Fade + rise 12px, stagger via `delay` prop, IntersectionObserver-based. Used liberally on homepage sections.

---

## Section 2 — Shared Components

### `BrandMark`
- Inline SVG: **building icon** (rounded square, 3 angled white lines suggesting a roof + floors) + "TAP" (Poppins 700, 24-28px, foreground) + "CATALOG" (Poppins 500, 10px, uppercase, tracked, muted-foreground, baseline aligned with bottom of TAP).
- 3 size variants: sm (24px TAP), md (32px TAP), lg (40px TAP).
- Used in Navbar (md), Footer (lg), og:image previews (lg).

### `Navbar`
- Background: `bg-background` solid (no blur/glass).
- Border bottom: 1px `border-border`.
- Layout: `BrandMark` left, nav links right, "Masuk" button at far right.
- Container: `max-w-7xl mx-auto px-4 sm:px-6`.
- Nav links: Manrope 14px medium, `text-foreground/70` → hover `text-foreground` + animated saddle-brown underline (transform origin left, scale-x-0 → 100 on hover, 200ms).
- Active route: `text-primary font-semibold` + 2px gold dot above.
- "Masuk" button: outline `border-primary text-primary` rounded-xl px-4 py-2, hover `bg-primary text-primary-foreground`.
- Sticky `top-0 z-40`.
- Drop `ThemeToggle`.

### `Footer`
- Background: `bg-primary` (saddle brown panel — replaces espresso from prior plan).
- Text: `text-primary-foreground` (off-white).
- Top: gold hairline (full width).
- 4 columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10`):
  1. **Brand** — `BrandMark` (inverted: brown box becomes off-white box with brown icon, or keep brown + off-white text), tagline from `BRAND.footer.tagline`, social icons (Instagram / WhatsApp / Mail) in 36px circles with 1px `border-primary-foreground/20`, hover `border-gold`.
  2. **Jelajahi** — column of 4 links (Rumah, Apartemen, Tanah, Ruko) → `/properti?type=…`.
  3. **Perusahaan** — Tentang Kami, Hubungi Kami, Kebijakan Privasi (placeholders `#`).
  4. **Kontak** — `MapPin` + `BRAND.contact.address`, `Mail` + email, `Phone` + phone.
- Bottom bar: hairline `border-primary-foreground/15`, copyright + small `BRAND.tagline` uppercase tracked.

### `PropertyCard` (restyle)
- Container: `rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md`.
- Top hairline: absolute 1px gold gradient, scale-x-0 → 100 on hover.
- Image: `h-56`, `object-cover`, hover `scale-105` (700ms), gradient overlay bottom `from-black/40 via-transparent to-transparent`.
- Top-left badges: `PropertyPills` (kept) — Dijual = solid `bg-primary text-primary-foreground`, Disewa = solid `bg-accent text-accent-foreground` (black). Type pill = `bg-black/40 text-white backdrop-blur-sm` (kept).
- Price: Poppins 600 22px `text-primary` + small "Rp" prefix (12px, `text-primary/80`).
- Title: Poppins 500 16px `text-foreground`, line-clamp-1, hover `text-primary`.
- Address: Poppins 400 12px `text-muted-foreground`, line-clamp-1, with `MapPin` 11px.
- Specs row: `border-t border-border/40 pt-3 mt-3`, lucide icons (`BedDouble`, `Bath`, `Maximize2`) 11px `text-primary/70`, separator `·` (small dot), text 12px `text-muted-foreground`. Tanah = only `Maximize2` + `m²`.

### `PropertyPills` (kept, retheme)
- Dijual: `bg-primary text-primary-foreground` solid.
- Disewa: `bg-accent text-accent-foreground` solid (black, no glass).
- Type: `bg-black/40 text-white backdrop-blur-sm` (kept).

### `SectionHeading` (retheme)
- Eyebrow: Poppins 500, 11px uppercase, tracked 0.22em, `text-primary`. Optional 6px gold hairline to the left.
- Title: Poppins 600, 32px (sm: 36px) `text-foreground`.
- Subtitle: Poppins 400, 14px (sm: 15px) `text-muted-foreground`, max-w-xl.
- Center or left align.

---

## Section 3 — Homepage

Structure: `Hero → About → How We Work → Properti → Kota Populer → Contact → Footer`.

### 1. Hero — REVISED per HTML mockup

- **Container**: section `relative overflow-hidden` (proportional height — target ~78vh like before, but mirror the mockup's vertical rhythm)
- **Photo**: skyscraper `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80` (matches mockup). `next/image` fill, `object-position: center 42%`.
- **Overlay**: **WHITE-to-transparent gradient** (mockup line 44): `linear-gradient(180deg, #fff 0%, rgba(255,255,255,.92) 26%, rgba(255,255,255,.35) 48%, rgba(255,255,255,0) 66%)`. Headline sits on the white portion (visible), photo shows in lower 2/3.
- **Headline** (Mulish, centered, ~63px desktop / 32-48px mobile):
  - Line 1: `font-light italic` (300) — "Discover Your Mission"
  - Line 2: `font-bold` (700) — "Build Our Passion"
  - `letter-spacing: -0.015em; line-height: 1.05; text-wrap: balance`
- **2 CTAs** — positioned at `margin-top: auto; margin-bottom: 76px` (bottom-center of hero, overlaid on photo):
  - "BOOK NOW" — `bg-primary color-white`, `border-radius: 22px`, `height: 44px; padding: 0 26px`, Mulish 700, 19px, `letter-spacing: 0.05em; text-transform: uppercase`, with chevron-right icon
  - "FOR SELLER" — `bg-#111 color-white`, same shape, no icon
  - Both at the bottom of the hero, on the photo portion (not in the white area)

### 2. About — REVISED per HTML mockup

- **Layout**: `position: relative; min-height: 768px; padding: 170px 72px 0; display: grid; grid-template-columns: 690px 1fr; column-gap: 60px; align-content: start`
- **Left column** (690px):
  - Title: "About Us" — Mulish 700, 62px, `letter-spacing: -0.02em`
  - Body paragraph: Mulish 400, 20px, `line-height: 34px; text-wrap: pretty`, max-width 690px, `margin-top: 82px`
  - Copy (matches mockup): "TAP Catalog is a federal network of commercial real estate agencies. We help companies from startups to coorporations – to find rent, buy, and property showcase. Our team takes care of the search, negotiations, legal verification, and transaction support until the contract is signed."
- **Right column** (1fr, with absolute-positioned image):
  - Image: skyscraper `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab` (same as hero but cropped), positioned `absolute; width: 400px; height: 500px; left: 966px; top: 269px` (bleeds beyond section bounds in the mockup). For responsive: use the same Unsplash photo, position right, bleed off right edge with overflow:hidden on parent.
- **Stats row** (full-width below, `grid-column: 1 / -1`, flex, gap 120px):
  - 3 columns, each `display: flex; flex-direction: column; align-items: center; gap: 22px`
  - Number: Mulish **300 LIGHT**, **120px**, `line-height: 0.8; letter-spacing: -0.03em`
  - Label: Mulish 400, 20px, `white-space: nowrap`
  - **Use mockup's literal numbers**: "20+" / "30" / "99%" with "served clients" / "our database" / "quality property" (NOT BRAND.stats which says "15.000+ Properti Aktif" etc — those are wrong for this design)
  - **OR** keep BRAND.stats but render in mockup's typography (120px, weight 300). Decision: use **mockup's literal stats for homepage** to match exactly; keep BRAND.stats for other contexts.

### 3. How We Work — REVISED per HTML mockup

- **Container**: `padding: 192px 72px 0` (very generous top padding)
- **Title**: "How We Work" — Mulish 700, 62px, centered, `letter-spacing: -0.02em`
- **4 cards** in `grid-template-columns: repeat(4, 1fr); gap: 16px` (NOT 5 like current — strict 4 columns):
  - Each card: `height: 385px; border: 1px solid #723511; background: transparent; border-radius: 24px; padding: 73px 28px 0; display: flex; flex-direction: column; align-items: center; text-align: center`
  - **Icon**: 66px × 66px circle, `background: #111; color: #fff`, lucide icon inside 30px × 30px (or 28×28), white stroke
  - **Title**: Mulish 700, 26px, `margin: 41px 0 0; letter-spacing: -0.01em`
  - **Description**: Mulish 400, 19px, `line-height: 27px; text-wrap: pretty; margin: 15px 0 0`
  - **Steps (4) — copy from mockup exactly**:
    1. **Free Consultation** — "consultation needs analysist. we determine what type of property you need" (MessageCircle icon)
    2. **Search & Selection** — "we offer only verified properties that match your budget and goals" (Search icon)
    3. **Data Verification** — "we conduct a review all documents and ownership" (FileText icon — note: mockup uses `file-text`, not `file-check`)
    4. **Finishing** — "we provide support include contract and accompany you at all stages" (Handshake icon)
  - **Note**: copy is in English (mockup literal). Decision: **keep English copy** for visual fidelity to mockup. Replace BRAND.howWeWork Indonesian copy with mockup's English.

### 4. Properti (Explore + Properti Terbaru) — KEEP existing

- Structure, ExploreTypes, PropertyCard, Properti Terbaru all kept from current implementation.
- Uses BRAND.stats etc.
- Out of scope for this rebuild revision.

### 5. Kota Populer — KEEP existing

- Out of scope for this rebuild revision.

### 6. Contact — REVISED per HTML mockup (major changes)

- **Container**: `position: relative; min-height: 768px`
- **"Contact" display word** (THE signature element):
  - `position: absolute; left: 72px; top: 160px; z-index: 2`
  - Font: Mulish **800** (extrabold), **143px**, `letter-spacing: -0.03em`
  - Color: `color: #fff` (white fill)
  - Stroke: `-webkit-text-stroke: 4px var(--primary)` (4px brown stroke)
  - **CRITICAL TRICK**: `paint-order: stroke fill` — this makes the stroke render BEHIND the fill, so where the text sits on the brown panel, the inside (white fill) is visible and the stroke (brown) blends with the brown panel. Where the text sits on the white background, the inside is white (matching background) and the brown stroke is the only visible part.
  - Result: text appears as OUTLINED on white area, FILLED on brown area — exactly the mockup effect.
- **Brown panel**: `position: absolute; left: 0; right: 0; top: 252px; bottom: 0; background: var(--primary); color: #fff; padding: 132px 72px 56px; display: grid; grid-template-columns: 1fr 560px; column-gap: 80px; align-items: start`
  - The text "Contact" (at top: 160px) overlaps the panel (starting at top: 252px) — the bottom half of the text is on the panel.
- **Left column** (form area — but mockup has content here too):
  - Italic 26px subtitle: "Tell us what you are looking for — we reply with a shortlist within one working day." — Mulish 300 italic, `line-height: 38px; max-width: 440px; text-wrap: pretty`
  - Contact info list (3 lines, gap 18px, font 20px):
    - `Mail` icon (20px, opacity 0.8) + "hello@tapcatalog.com"
    - `Phone` icon (20px, opacity 0.8) + "+62 21 5000 1200"
    - `MapPin` icon (20px, opacity 0.8) + "Jl. Jend. Sudirman 52, Jakarta"
- **Right column** (form, 560px wide):
  - 3 fields (NOT 4 — mockup has no textarea):
    1. "Full name" (text)
    2. "Work email" (email)
    3. "What are you looking for?" (text)
  - Input style: `height: 56px; padding: 0 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,.45); background: transparent; color: #fff; font-size: 19px; outline: none`
  - Submit button: `height: 56px; border: 0; border-radius: 12px; background: #fff; color: var(--primary); font-size: 19px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer` — hover: `background: #111; color: #fff`
  - Form gap 16px
  - Form is **inert** (just `e.preventDefault()` + state change to show "Thank you")
- **Footer line** (full-width at bottom of panel, `grid-column: 1 / -1`):
  - Flex between: "© 2026 TAP Catalog" (left) | "Commercial real estate network" (right)
  - Font: 16px, `color: rgba(255,255,255,.7)`

---

## Section 4 — Catalog, Detail, Map

### `/properti` (Catalog)
- Header section:
  - `SectionHeading` (center) eyebrow "Katalog", title "Katalog Properti".
  - Result count line: Poppins 400 14px `text-muted-foreground` "Menampilkan **24** properti" — angka `text-primary italic font-semibold`.
- Filter sidebar (desktop): `rounded-3xl bg-secondary/60 p-6` borderless.
  - Labels uppercase 11px Poppins 500 `text-muted-foreground` tracked.
  - Inputs/Selects: `rounded-xl bg-background border border-border`, focus `ring-2 ring-primary`.
  - Range slider (price): saddle brown track.
  - "Reset" ghost button at bottom.
- Filter mobile: `Sheet` with `SectionHeading` (left) + full-width "Terapkan" button `bg-primary text-primary-foreground`.
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5` with PropertyCard baru.
- Skeleton: warm-tinted shimmer (use `--secondary` base, `bg-secondary/40` animated).
- Empty state: `SearchX` in 64px circle `border-2 border-primary text-primary`, Poppins 600 18px "Tidak ada properti ditemukan", reset CTA button.

### `/properti/[id]` (Detail)
- Gallery: `rounded-2xl overflow-hidden`, primary `h-[420px]`, thumbnails row `h-20` 4-kolom.
- Lightbox: kept, backdrop `bg-accent/95` (black 95%).
- Title block: Price first (Poppins 700 36px `text-primary` + "Rp" small prefix), then title Poppins 600 24px `text-foreground`, address Poppins 400 14px muted + `MapPin`.
- Specs strip: 4-kolom grid with vertical hairline dividers (KT / KM / LB / LT), value Poppins 700 28px `text-primary`, label Poppins 500 10px uppercase tracked.
- Description: Poppins 400 15px `text-foreground/85` leading-relaxed prose. Section headings Poppins 600 20px.
- AgentCard: `rounded-3xl bg-secondary/40 p-6`, avatar 80px with 2px saddle brown ring, name Poppins 600 18px, role "Agen" badge, WhatsApp button `bg-primary text-primary-foreground` rounded-xl (saddle brown, not WA green), "Simpan" heart secondary outline button (links to favorite toggle, no new logic).
- Map: Leaflet in `rounded-2xl overflow-hidden border border-border`, ghost "Buka di Google Maps" link below.

### `/peta`
- Re-theme only: marker popups use Poppins title, saddle brown price, saddle brown "Lihat Detail" button.
- Page heading: `SectionHeading` (center) eyebrow "Peta", title "Peta Properti".

---

## Section 5 — Auth, Profile, Technical Plan

### `/masuk` & `/daftar`
- Split-screen desktop: `grid lg:grid-cols-2 min-h-[calc(100vh-56px)]`:
  - Left: property photo (`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=1600&fit=crop` or similar) + saddle brown overlay `from-primary/85 to-primary/40` + large "TAP CATALOG" outlined wordmark centered.
  - Right: form on `bg-background` p-12, max-w-md centered.
- Mobile: left becomes top banner h-56, form below.
- Form: labels Poppins 500 11px uppercase tracked `text-muted-foreground`. Inputs `rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary`. Submit full-width `bg-primary text-primary-foreground rounded-xl btn-press`. Errors: `text-destructive` Poppins 400 13px. Cross-links `text-primary underline underline-offset-4`.
- Auth logic untouched.

### `/profil`
- Header: `flex items-center gap-5 pb-8 border-b border-border`:
  - Avatar 80px rounded-full `border-2 border-primary`.
  - Name Poppins 600 24px.
  - Email Poppins 400 14px `text-muted-foreground`.
  - Role pill: `rounded-full bg-primary text-primary-foreground` Poppins 600 10px uppercase tracked px-3 py-1.
- Tabs: Favorites (PropertyCard grid) | Pengaturan (existing).
- Favorites empty: `Heart` in 64px circle `border-2 border-primary text-primary`, "Belum ada favorit" + "Jelajahi Properti" CTA.

### Technical plan

**Execution order (5 stages, each must pass `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`):**

1. **Foundation** — `globals.css` token rewrite (saddle brown primary, off-white bg, drop dark, drop brown/gold scales, drop espresso, drop hero-overlay). `layout.tsx` font swap (Poppins + Manrope), drop `suppressHydrationWarning`. `lib/brand.ts`: TAP CATALOG, new copy. Delete `components/ThemeToggle.tsx`. Strip all `dark:` variants across codebase. Strip `next-themes` `ThemeProvider` (or keep inert).
2. **Primitives & shared** — `Reveal` (retained, retuned). `SectionHeading` (retheme). `BrandMark` (new — building icon SVG + TAP + CATALOG). `PropertyPills` (retheme). Navbar (rebuild — Manrope, no toggle). Footer (rebuild — saddle brown panel). PropertyCard (rewrite to match Section 2).
3. **Homepage** — Hero, About, HowWeWork, ExploreTypes+PropertiTerbaru, KotaPopuler, Contact. Update `app/page.tsx` to new structure. New components: `AboutSection`, `HowWeWork`, `ContactSection` (keep names task-friendly).
4. **Catalog + Detail + Map** — `PropertyFilter`, `app/properti/page.tsx`, `app/properti/[id]/page.tsx`, `components/PropertyGalleryClient.tsx`, `components/AgentCard.tsx`, `app/peta/page.tsx`, marker popups.
5. **Auth + Profile** — `app/masuk/page.tsx`, `app/daftar/page.tsx`, `app/profil/page.tsx`, split-screen layout, profile header restyle.

**Error handling:** No new logic. Contact form is inert in v1 (UI only, no submit). Existing auth/registration forms keep their server-side validation, only restyled.

**Testing:** Existing Jest tests stay green. Update `PropertyCard.test.tsx` price assertion. Add tests for new components: `Reveal`, `SectionHeading`, `BrandMark`, `HowWeWork`, `ContactSection` (snapshot + props). Manual visual via `pnpm dev` each stage.

**Out of scope:** `/admin/*` (keep current style — admin panel stays as-is), API routes, DB schema, auth logic, UploadThing, og-image generation, dark mode.

**Risks / mitigation:**
- Stripping `dark:` variants may surface hard-to-spot contrast bugs — manual light-mode-only pass at end of Stage 1.
- Removing `next-themes` could break if any other component imports it — verify with grep before deletion.
- Form inert in v1 — clearly label TODO and ensure sonner success toast on submit to avoid user confusion.
- Brand rename "Tiga Anak Propertindo" → "TAP CATALOG" — must update sitemap, robots, JSON-LD schema on detail page, og:site_name, favicon, OG image, README, page title patterns in `lib/brand.ts` (`pageTitle.*`), `package.json` `name` (optional), CI badge labels.
