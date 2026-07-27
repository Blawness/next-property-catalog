# TAP CATALOG — Homepage Redesign (Reference-Driven)

**Date:** 2026-07-27
**Status:** Approved (all 5 sections approved by user during brainstorm)
**Reference:** `references/web tap catalog.svg` (1024×2304 wireframe — "Discover Your Mission / Build Our Passion", About stats, How We Work 4-card grid, Contact outlined word)
**Supersedes:** `2026-07-26-premium-ui-redesign-design.md` (the "Warm Luxury / Resort" direction is abandoned)

## Problem

The existing premium UI plan (bronze/gold, Fraunces serif, dark mode, editorial bento) does not match the new visual direction provided by the user. The user supplied a hand-crafted SVG wireframe (`web tap catalog.svg`) under the brand **TAP CATALOG** with a distinctly different aesthetic: bold saddle brown, black accent, sans-serif typography, flat layouts, outlined display type, light-only. We need a fresh spec that re-aligns all public pages to this reference.

## Design Direction

**Bold Catalog / Real Estate Agency** — direct, high-contrast, easy to scan. Reference feel: real estate broker microsite (clean type, big stats, 4-step "How We Work" trust builder, contact form closer). Voice: confident, informative, B2C residential.

## Brand Decision

- `BRAND.name`: **"TAP CATALOG"** (replaces "Tiga Anak Propertindo"). All page titles, metadata, footer copyright, OpenGraph, sitemap updated.
- `BRAND.fullName`: "TAP CATALOG — Katalog Properti Indonesia"
- `BRAND.tagline`: "Katalog Properti #1 Indonesia"
- `BRAND.headline`: kept as `["Temukan", "Properti", "Impianmu"]` — used in marketing copy / page description / 404 fallback. The Hero section uses the **English reference text** ("Discover Your Mission / Build Our Passion") as a faithful homage to the wireframe, so `BRAND.headline` is NOT rendered on the homepage.
- Logo: inline SVG **building icon** (3 angled lines inside a rounded square, lifted from reference) + **"TAP"** wordmark (Poppins 700) + small **"CATALOG"** caption (Poppins 500, uppercase, tracked). Light mode only.

---

## Section 1 — Foundation (Design Tokens)

### Color (light only — dark mode dropped)

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.99 0.005 80)` | warm off-white page bg |
| `--foreground` | `oklch(0.18 0.005 60)` | near-black body text |
| `--primary` | `oklch(0.45 0.12 40)` | **saddle brown** — CTAs, borders, outlined type |
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

### Typography (next/font/google)

- **Display + body:** `Poppins` (variable, weights 300/400/500/600/700) → `--font-poppins`
- **Navbar:** `Manrope` (variable, weights 400/500/600/700) → `--font-manrope`
- All `.font-display` references resolve to Poppins (no serif).
- Replace Fraunces + Jost from prior plan.

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

### 1. Hero
- Section: `relative h-[78vh] min-h-[560px] max-h-[820px] overflow-hidden`.
- Background: parallax disabled (clean static) or subtle (5-10% translateY on scroll). `next/image` of `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop` (modern house + pool, same as plan's CTA image).
- Overlay: `linear-gradient(to bottom, black/30 0%, black/10 50%, black/55 100%)` for text readability.
- Top hairline: gold gradient (40-60%), 1px.
- Centered content (z-10):
  - Headline 2 lines, Poppins:
    - Line 1: `font-light italic text-3xl sm:text-4xl md:text-5xl` — "Discover Your Mission" (kept as English reference-style accent)
    - Line 2: `font-bold text-4xl sm:text-5xl md:text-6xl` — "Build Our Passion"
  - Subtitle: Poppins 400, 14-16px, `text-white/70`, max-w-md, 1-2 baris.
  - 2 buttons in a flex row, gap-3:
    - "BOOK NOW →" — `bg-primary text-primary-foreground` rounded-xl px-6 py-3 Poppins 600 13px tracked, hover `bg-primary/90`, `btn-press`.
    - "FOR SELLER" — `border border-white/40 text-white` rounded-xl, hover `bg-white/10`.
  - Optional: scroll cue (ChevronDown) bottom-center, `text-white/30`, pointer-events-none.

### 2. About
- Section: `container mx-auto px-4 py-16 sm:py-20`.
- `SectionHeading` (center): eyebrow "Tentang Kami", title "Tentang TAP CATALOG", subtitle "Katalog properti terlengkap untuk menemukan rumah, apartemen, tanah, dan ruko di seluruh Indonesia."
- 2-column on `md:grid-cols-2 gap-10 items-center`:
  - Left: paragraph Poppins 400 15px `text-muted-foreground` leading-relaxed, ~3-4 baris tentang misi.
  - Right: photo of skyscraper (`https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=1100&fit=crop` or similar) rounded-3xl object-cover h-[420px].
- Below: 3 stats in `grid-cols-3 gap-8` with vertical hairline dividers (`divide-x`):
  - "15.000+" / "Properti Aktif" — from `BRAND.stats[0]`
  - "34" / "Provinsi" — from `BRAND.stats[1]`
  - "500+" / "Agen Terpercaya" — from `BRAND.stats[2]`
- Stats: Poppins 700 56-64px `text-primary` + Poppins 500 11px uppercase tracked 0.18em `text-muted-foreground`.

### 3. How We Work
- Section: `container mx-auto px-4 py-16 sm:py-20`.
- `SectionHeading` (center): eyebrow "Layanan", title "Bagaimana Kami Bekerja", subtitle "Proses mudah menemukan properti yang tepat untuk Anda."
- 4 cards in `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`:
  - Card: `rounded-2xl border-2 border-primary p-7 flex flex-col items-center text-center bg-background`.
  - Icon: lucide inside 56px circle `bg-accent text-accent-foreground` (black bg + off-white icon), icon size 24, strokeWidth 1.75.
  - Title: Poppins 600 17px `text-foreground` mt-5.
  - Description: Poppins 400 13px `text-muted-foreground` leading-relaxed mt-2.
  - Steps (4):
    1. **Konsultasi Gratis** — "Konsultasi kebutuhanmu, kami bantu tentukan tipe properti yang sesuai." (MessageCircle)
    2. **Cari & Pilih** — "Telusuri katalog terverifikasi, filter sesuai budget dan lokasi." (Search)
    3. **Verifikasi Data** — "Setiap listing melalui proses verifikasi dokumen dan legalitas." (FileCheck)
    4. **Hubungi Agen** — "Terhubung langsung dengan agen terpercaya untuk kunjungan & negosiasi." (Handshake)

### 4. Properti (Explore + Properti Terbaru digabung)
- Section: `container mx-auto px-4 py-16 sm:py-20`.
- `SectionHeading` (center): eyebrow "Listing", title "Properti Pilihan", subtitle "Listing terbaru dari agen terpercaya di seluruh Indonesia."
- **Sub-section A — ExploreTypes**: 4 kartu dalam `grid grid-cols-2 lg:grid-cols-4 gap-4`:
  - Card: `rounded-2xl border-2 border-primary p-5 flex items-center gap-4 hover:bg-primary hover:text-primary-foreground transition-colors group`.
  - Icon: lucide dalam 44px circle `bg-primary/10 text-primary` (group hover: `bg-primary-foreground/15 text-primary-foreground`).
  - Label: Poppins 600 16px.
  - Count: Poppins 500 10px uppercase tracked `text-muted-foreground` (group hover: `text-primary-foreground/70`).
  - `Reveal` stagger 80ms.
  - Queries: same as plan, group by `properties.type` for counts.
- **Sub-section B — Properti Terbaru**: 3-kolom grid PropertyCard (Reveal stagger 90ms), 6 listing.
- Mobile: stack vertically.

### 5. Kota Populer
- Section: `container mx-auto px-4 py-16 sm:py-20`.
- `SectionHeading` (center): eyebrow "Lokasi", title "Kota Populer", subtitle "Listing properti di kota-kota besar Indonesia."
- Bento grid `grid auto-rows-[160px] grid-cols-2 md:auto-rows-[200px] md:grid-cols-4 gap-4`:
  - 6 cards dari `BRAND.popularCities.cities` (Jakarta, Bandung, Surabaya, Yogyakarta, Bali, Semarang).
  - Layout: index 0 large (col-span-2 row-span-2), 1-5 smaller.
  - Each: rounded-3xl overflow-hidden, next/image fill, overlay `from-accent/85 via-accent/20 to-transparent`, bottom-left city name (Poppins 600 18px italic `text-white` + `MapPin` 14px `text-gold`) + count (Poppins 500 10px uppercase tracked `text-white/60`).
  - Reveal stagger 70ms.
  - `getCityCounts()` async (same query as plan).

### 6. Contact
- Section: `bg-background pt-16 sm:pt-20`.
- Display word: "Contact" — Poppins 800 italic, `clamp(5rem, 18vw, 12rem)`, `text-transparent [-webkit-text-stroke:2px_var(--primary)]` (outlined only), `leading-[0.9] tracking-tight`, centered or left-aligned bleeding off edge.
- Panel: `bg-primary text-primary-foreground` — rounded-t-3xl or full-bleed, py-20.
- 2-column `container mx-auto px-4 grid lg:grid-cols-2 gap-12`:
  - **Left (form)**:
    - Heading: Poppins 600 24px "Hubungi Kami" + subtitle Poppins 400 14px `text-primary-foreground/70`.
    - Fields (vertical stack, gap-4):
      - Nama (text input)
      - Email (email input)
      - No. Telepon (tel input)
      - Pesan (textarea 4 rows)
    - Input style: `rounded-xl bg-primary-foreground/95 text-foreground border-0 focus:ring-2 focus:ring-gold` — labels Poppins 500 11px uppercase tracked `text-primary-foreground/80` above each field.
    - Submit: Poppins 600 13px tracked, `bg-primary-foreground text-primary` rounded-xl px-6 py-3, hover `bg-gold text-primary-foreground`.
    - **Inert in v1** — no onSubmit handler, no API. `onSubmit` calls `e.preventDefault()` and shows a sonner success toast "Pesan terkirim! Kami akan menghubungi Anda segera." (placeholder copy; no network). Clearly NOT a real submission.
  - **Right (info)**:
    - Poppins 600 18px "Informasi Kontak"
    - Vertical list with icons: `MapPin`+address, `Mail`+email, `Phone`+phone, `Clock`+jam operasional.
    - Social icons row (Instagram, WhatsApp, Facebook) dalam 40px circle outline `border-primary-foreground/20`, hover `border-gold text-gold`.
    - Optional: small embed preview or CTA "Lihat di Peta →" link ke `/peta`.

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
