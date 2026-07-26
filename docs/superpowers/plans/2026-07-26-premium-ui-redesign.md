# Premium UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform all public pages of Tiga Anak Propertindo from generic-looking to a "Warm Luxury / Resort" premium aesthetic, token-first.

**Architecture:** Rebuild design tokens in `app/globals.css` (warm neutrals, bronze primary, gold/espresso accents, Fraunces + Jost fonts), then restyle in layers: shared primitives → homepage → catalog/detail/map → auth/profile. No behavior changes; admin panel, API, DB untouched.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (CSS-first config), next/font/google, lucide-react, Jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-26-premium-ui-redesign-design.md`

**Approved deviations from spec (decided during planning):**
1. `--hero-overlay-*` CSS vars are KEPT (re-valued to warm espresso) instead of deleted — `HeroSection` is their only consumer and they are well-named single-purpose tokens.
2. Detail page: no "Simpan"/heart button — no favorite-toggle UI exists today; adding one is a new feature (out of scope).
3. Detail page price: fixes an existing bug where `formatPriceFull` already appends `/bulan` for sewa AND the page appended another `/bulan` span (double suffix).
4. Footer contact info (email/phone/address) is new placeholder content centralized in `lib/brand.ts` — user can edit later.

**Verification order (every gate):** `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`

---

## Stage 1 — Foundation

### Task 1: Rewrite design tokens in globals.css

**Files:**
- Modify: `app/globals.css` (token sections only; keep all animation keyframes)

- [ ] **Step 1: Replace the token sections of `app/globals.css`**

Replace everything from `@theme inline {` through the end of the `.dark { }` block (currently lines 7–156) with the following. Keep lines 1–5 (imports + custom-variant) and everything from `@layer base` onward unchanged, EXCEPT the two changes in Step 2.

```css
@theme {
  --color-gold: oklch(0.72 0.09 78);
  --color-gold-light: oklch(0.84 0.06 84);
  --color-espresso: oklch(0.225 0.014 50);
  --color-espresso-foreground: oklch(0.93 0.012 80);
  --shadow-luxe-sm: 0 2px 12px -2px oklch(0.32 0.03 55 / 0.10);
  --shadow-luxe: 0 24px 55px -18px oklch(0.32 0.03 55 / 0.22);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-jost), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --font-heading: var(--font-fraunces), Georgia, serif;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --color-brown-50: oklch(0.965 0.018 78);
  --color-brown-100: oklch(0.94 0.032 74);
  --color-brown-200: oklch(0.878 0.055 70);
  --color-brown-300: oklch(0.79 0.085 64);
  --color-brown-400: oklch(0.685 0.105 58);
  --color-brown-500: oklch(0.50 0.115 52);
  --color-brown-600: oklch(0.435 0.105 50);
  --color-brown-700: oklch(0.37 0.09 48);
  --color-brown-800: oklch(0.305 0.07 47);
  --color-brown-900: oklch(0.25 0.05 46);
}

:root {
  --background: oklch(0.978 0.006 85);
  --foreground: oklch(0.27 0.012 55);
  --card: oklch(0.99 0.004 85);
  --card-foreground: oklch(0.27 0.012 55);
  --popover: oklch(0.99 0.004 85);
  --popover-foreground: oklch(0.27 0.012 55);
  --primary: oklch(0.50 0.115 52);
  --primary-foreground: oklch(0.985 0.005 85);
  --secondary: oklch(0.945 0.012 72);
  --secondary-foreground: oklch(0.30 0.015 55);
  --muted: oklch(0.955 0.009 75);
  --muted-foreground: oklch(0.475 0.02 60);
  --accent: oklch(0.932 0.02 74);
  --accent-foreground: oklch(0.30 0.015 55);
  --destructive: oklch(0.577 0.215 27);
  --border: oklch(0.905 0.012 72);
  --input: oklch(0.905 0.012 72);
  --ring: oklch(0.50 0.115 52);
  --radius: 0.875rem;
  --hero-overlay-dark: rgba(34, 25, 16, 0.84);
  --hero-overlay-medium: rgba(34, 25, 16, 0.58);
  --hero-overlay-light: rgba(34, 25, 16, 0.22);
  --sidebar: oklch(0.965 0.009 78);
  --sidebar-foreground: oklch(0.27 0.012 55);
  --sidebar-primary: oklch(0.50 0.115 52);
  --sidebar-primary-foreground: oklch(0.985 0.005 85);
  --sidebar-accent: oklch(0.932 0.02 74);
  --sidebar-accent-foreground: oklch(0.30 0.015 55);
  --sidebar-border: oklch(0.905 0.012 72);
  --sidebar-ring: oklch(0.50 0.115 52);
  --chart-1: oklch(0.50 0.115 52);
  --chart-2: oklch(0.35 0.03 55);
  --chart-3: oklch(0.55 0.03 60);
  --chart-4: oklch(0.70 0.025 65);
  --chart-5: oklch(0.84 0.02 72);
}

.dark {
  --background: oklch(0.175 0.008 55);
  --foreground: oklch(0.94 0.008 80);
  --card: oklch(0.215 0.009 55);
  --card-foreground: oklch(0.94 0.008 80);
  --popover: oklch(0.215 0.009 55);
  --popover-foreground: oklch(0.94 0.008 80);
  --primary: oklch(0.66 0.11 60);
  --primary-foreground: oklch(0.16 0.01 50);
  --secondary: oklch(0.26 0.012 55);
  --secondary-foreground: oklch(0.93 0.01 75);
  --muted: oklch(0.25 0.01 55);
  --muted-foreground: oklch(0.70 0.015 65);
  --accent: oklch(0.285 0.015 58);
  --accent-foreground: oklch(0.94 0.01 78);
  --destructive: oklch(0.704 0.191 22);
  --border: oklch(0.94 0.01 75 / 12%);
  --input: oklch(0.94 0.01 75 / 15%);
  --ring: oklch(0.66 0.11 60);
  --hero-overlay-dark: rgba(18, 13, 8, 0.88);
  --hero-overlay-medium: rgba(18, 13, 8, 0.62);
  --hero-overlay-light: rgba(18, 13, 8, 0.28);
  --sidebar: oklch(0.215 0.009 55);
  --sidebar-foreground: oklch(0.94 0.008 80);
  --sidebar-primary: oklch(0.66 0.11 60);
  --sidebar-primary-foreground: oklch(0.16 0.01 50);
  --sidebar-accent: oklch(0.285 0.015 58);
  --sidebar-accent-foreground: oklch(0.94 0.01 78);
  --sidebar-border: oklch(0.94 0.01 75 / 12%);
  --sidebar-ring: oklch(0.66 0.11 60);
  --chart-1: oklch(0.66 0.11 60);
  --chart-2: oklch(0.94 0.008 80);
  --chart-3: oklch(0.70 0.015 65);
  --chart-4: oklch(0.55 0.02 60);
  --chart-5: oklch(0.38 0.015 58);
}
```

- [ ] **Step 2: Remove the manual `.font-display` utility and lower grain opacity**

In `@layer utilities` (around lines 170–174), DELETE this block (the `font-display` utility is now auto-generated by Tailwind from the `--font-display` theme key):

```css
@layer utilities {
  .font-display {
    font-family: var(--font-cormorant), Georgia, serif;
  }
}
```

In `.hero-grain::after`, change `opacity: 0.035;` to `opacity: 0.028;`.

- [ ] **Step 3: Verify build compiles**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (CSS-only change; `brown-*` classes still resolve so admin pages keep working).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(ui): warm luxury design tokens — ivory/espresso neutrals, bronze, gold accents"
```

### Task 2: Swap fonts to Fraunces + Jost

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace font loading in `app/layout.tsx`**

Replace lines 2–3 (`import { Geist } ...` and `import { Cormorant_Garamond } ...`):

```tsx
import { Fraunces, Jost } from "next/font/google"
```

Replace lines 11–17 (`const geist = ...` and `const cormorant = ...`):

```tsx
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" })
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
})
```

Replace the `<html>` tag (line 26):

```tsx
<html lang="id" className={`${jost.variable} ${fraunces.variable}`} suppressHydrationWarning>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: PASS. Google fonts are fetched at build time — if the sandbox has no network access and the font fetch fails, flag it to the user; do NOT work around it with local fonts.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(ui): swap Geist/Cormorant for Jost/Fraunces, fix font wiring"
```

### Task 3: Stage 1 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all PASS (existing tests unaffected at this point).

---

## Stage 2 — Primitives & Shared Components

### Task 4: `Reveal` scroll-reveal component

**Files:**
- Create: `components/Reveal.tsx`
- Test: `components/Reveal.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Reveal.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import Reveal from '@/components/Reveal'

let ioCallback: IntersectionObserverCallback

beforeEach(() => {
  ;(globalThis as any).IntersectionObserver = jest.fn((cb: IntersectionObserverCallback) => {
    ioCallback = cb
    return { observe: jest.fn(), disconnect: jest.fn(), unobserve: jest.fn() }
  })
})

describe('Reveal', () => {
  it('renders children', () => {
    render(<Reveal>Hello content</Reveal>)
    expect(screen.getByText('Hello content')).toBeInTheDocument()
  })

  it('starts hidden and becomes visible on intersection', () => {
    const { container } = render(<Reveal>Hi</Reveal>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('opacity-0')
    act(() => {
      ioCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(el.className).toContain('opacity-100')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- Reveal`
Expected: FAIL — module `@/components/Reveal` not found.

- [ ] **Step 3: Create `components/Reveal.tsx`**

```tsx
"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** stagger delay in ms */
  delay?: number
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- Reveal`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/Reveal.tsx components/Reveal.test.tsx
git commit -m "feat(ui): add Reveal scroll-reveal primitive"
```

### Task 5: `SectionHeading` component

**Files:**
- Create: `components/SectionHeading.tsx`
- Test: `components/SectionHeading.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/SectionHeading.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import SectionHeading from '@/components/SectionHeading'

describe('SectionHeading', () => {
  it('renders eyebrow, title and subtitle', () => {
    render(<SectionHeading eyebrow="Kategori" title="Judul Section" subtitle="Subjudul di sini" />)
    expect(screen.getByText('Kategori')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Judul Section' })).toBeInTheDocument()
    expect(screen.getByText('Subjudul di sini')).toBeInTheDocument()
  })

  it('renders title only when eyebrow/subtitle omitted', () => {
    render(<SectionHeading title="Hanya Judul" />)
    expect(screen.getByRole('heading', { name: 'Hanya Judul' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- SectionHeading`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/SectionHeading.tsx`**

```tsx
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center"
  return (
    <div className={cn("mb-10", centered ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brown-600",
            centered && "justify-center",
          )}
        >
          <span aria-hidden className="h-px w-6 bg-gold/70" />
          {eyebrow}
          {centered && <span aria-hidden className="h-px w-6 bg-gold/70" />}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- SectionHeading`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/SectionHeading.tsx components/SectionHeading.test.tsx
git commit -m "feat(ui): add SectionHeading primitive (eyebrow + display title)"
```

### Task 6: `BrandMark` logomark

**Files:**
- Create: `components/BrandMark.tsx`

- [ ] **Step 1: Create `components/BrandMark.tsx`**

```tsx
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: number
  className?: string
}

export default function BrandMark({ size = 30, className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-lg bg-gradient-to-br from-brown-400 via-brown-500 to-brown-700 font-display font-semibold italic text-white shadow-sm",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.44) }}
    >
      TA
    </span>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/BrandMark.tsx
git commit -m "feat(ui): add BrandMark monogram logomark"
```

### Task 7: `PropertyPills` shared badge pills

**Files:**
- Create: `components/PropertyPills.tsx`

- [ ] **Step 1: Create `components/PropertyPills.tsx`**

```tsx
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface PropertyPillsProps {
  listingType: string
  type: string
  className?: string
}

export default function PropertyPills({ listingType, type, className }: PropertyPillsProps) {
  const isJual = listingType === "jual"
  return (
    <div className={cn("flex gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-[3px] text-[10px] font-bold tracking-wide shadow-md",
          isJual
            ? "bg-brown-500 text-white shadow-brown-500/40"
            : "bg-espresso/70 text-white shadow-black/20 backdrop-blur-sm",
        )}
      >
        {isJual ? "Dijual" : "Disewa"}
      </span>
      <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-[3px] text-[10px] font-semibold text-white backdrop-blur-sm">
        {PROPERTY_TYPE_LABELS[type]}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/PropertyPills.tsx
git commit -m "feat(ui): add PropertyPills (kill sky-500, dark-glass Disewa pill)"
```

### Task 8: PropertyCard restyle

**Files:**
- Modify: `components/PropertyCard.tsx` (full rewrite)
- Test: `components/PropertyCard.test.tsx` (update price assertion)

- [ ] **Step 1: Update the test FIRST (price markup changes)**

In `components/PropertyCard.test.tsx`, replace the second test with:

```tsx
  it('formats price correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/1\.0 M/)).toBeInTheDocument()
    expect(screen.getByText('Rp')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- PropertyCard`
Expected: FAIL on price test (old markup has `Rp 1.0 M` as a single string).

- [ ] **Step 3: Rewrite `components/PropertyCard.tsx`**

```tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react"
import type { PropertyWithImages } from "@/lib/types"
import { formatPriceCompact } from "@/lib/constants"
import PropertyPills from "@/components/PropertyPills"

export default function PropertyCard({ property }: { property: PropertyWithImages }) {
  const primaryImage = property.images.find((i) => i.isPrimary) ?? property.images[0]

  const hasSpecs =
    property.type === "tanah"
      ? property.landArea != null
      : property.bedrooms != null || property.bathrooms != null || property.buildingArea != null

  const priceText = formatPriceCompact(property.price, property.listingType)
  const priceMain = priceText.replace(/^Rp\s*/, "")

  return (
    <Link
      href={`/properti/${property.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe"
    >
      {/* Gold hairline on hover */}
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 z-10 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative h-56 overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground/40">
            Tidak ada foto
          </div>
        )}

        {/* Hover overlay with photo count */}
        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-black/30 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {property.images.length} foto
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3">
          <PropertyPills listingType={property.listingType} type={property.type} />
        </div>
      </div>

      <div className="p-5">
        <p className="mb-1 font-display text-[1.45rem] font-semibold leading-tight text-brown-600">
          <span className="mr-0.5 align-top text-[0.62em] font-medium text-brown-500/80">Rp</span>
          {priceMain}
        </p>

        <h3 className="mb-2 line-clamp-1 font-display text-[1.05rem] font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-brown-600">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <MapPin size={11} className="shrink-0 text-brown-500" />
          <span className="line-clamp-1">{property.address ?? property.city}</span>
        </div>

        {hasSpecs && (
          <div className="mt-3.5 flex items-center gap-3 border-t border-border/40 pt-3 text-[12px] text-muted-foreground">
            {property.type === "tanah" ? (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={11} className="text-brown-500/70" />
                {property.landArea} m²
              </span>
            ) : (
              <>
                {property.bedrooms != null && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={11} className="text-brown-500/70" />
                    {property.bedrooms} KT
                  </span>
                )}
                {property.bedrooms != null && property.bathrooms != null && (
                  <span aria-hidden className="h-3 w-px bg-border" />
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-1.5">
                    <Bath size={11} className="text-brown-500/70" />
                    {property.bathrooms} KM
                  </span>
                )}
                {property.buildingArea != null && (
                  <span aria-hidden className="h-3 w-px bg-border" />
                )}
                {property.buildingArea != null && (
                  <span className="flex items-center gap-1.5">
                    <Maximize2 size={11} className="text-brown-500/70" />
                    {property.buildingArea} m²
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test -- PropertyCard`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/PropertyCard.tsx components/PropertyCard.test.tsx
git commit -m "feat(ui): luxury PropertyCard — Fraunces price tag, gold hairline, calm hover"
```

### Task 9: Navbar restyle

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Apply edits to `components/Navbar.tsx`**

a) Imports — add `useEffect`, `useState`, `cn`, `BrandMark` (keep `Image` — still used for avatar):

```tsx
import { useEffect, useState } from "react"
```
```tsx
import BrandMark from "@/components/BrandMark"
import { cn } from "@/lib/utils"
```

b) Add scroll state inside the component (after `const pathname = usePathname()`):

```tsx
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
```

c) Replace the `<header>` opening tag, and add the gold hairline right after `</nav>`:

```tsx
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
```
```tsx
      </nav>
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 inset-x-0 h-px transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.55), transparent)",
        }}
      />
    </header>
```

d) Replace the logo block (the `<Link href="/" ...>` with the favicon `Image` + wordmark):

```tsx
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <BrandMark size={28} className="transition-transform duration-200 group-hover:scale-105" />
          <span className="font-display font-bold text-[1.35rem] italic text-foreground tracking-tight leading-none">
            {BRAND.name}
          </span>
        </Link>
```

e) Active link indicator — inside the nav-link map, replace the `Icon` + underline markup:

```tsx
                <span
                  className={cn(
                    "h-1 w-1 shrink-0 rounded-full transition-colors",
                    active ? "bg-gold" : "bg-transparent",
                  )}
                />
                <Icon
                  size={13}
                  strokeWidth={2.5}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-brown-500" : "text-foreground/40 group-hover:text-foreground/70",
                  )}
                />
                {label}
                <span
                  className={cn(
                    "absolute -bottom-[1.15rem] left-0 right-0 h-px transition-transform duration-300 origin-left",
                    active ? "bg-gold scale-x-100" : "bg-brown-400 scale-x-0 group-hover:scale-x-100",
                  )}
                />
```

f) "Masuk" button — replace its className:

```tsx
              className="flex items-center gap-1.5 rounded-xl border border-brown-500/50 px-4 py-2 text-[12px] font-bold tracking-wide text-brown-700 transition-all duration-150 hover:bg-brown-500 hover:text-white dark:text-brown-300 dark:hover:text-white"
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(ui): Navbar — BrandMark logo, glass bg, gold active indicators"
```

### Task 10: Brand content for footer & CTA banner

**Files:**
- Modify: `lib/brand.ts`

- [ ] **Step 1: Replace the `footer` block and add `contact` + `cta` in `lib/brand.ts`**

Replace the existing `footer: { ... }` block (end of the BRAND object) with:

```ts
  contact: {
    email: "halo@tigaanakpropertindo.id",
    phone: "+62 812-3456-7890",
    address: "Jl. Sudirman Kav. 21, Jakarta Selatan",
  },

  cta: {
    heading: "Siap Menemukan Properti Impianmu?",
    subheading:
      "Jelajahi ribuan listing terkurasi di seluruh Indonesia dan wujudkan hunian yang kamu dambakan.",
    buttonLabel: "Jelajahi Properti",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop&auto=format&q=80",
  },

  footer: {
    tagline: "Platform properti terpercaya di Indonesia",
    explore: [
      { label: "Rumah", href: "/properti?type=rumah" },
      { label: "Apartemen", href: "/properti?type=apartemen" },
      { label: "Tanah", href: "/properti?type=tanah" },
      { label: "Ruko", href: "/properti?type=ruko" },
    ],
    company: [
      { label: "Tentang Kami", href: "#" },
      { label: "Hubungi Kami", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: FAIL in `components/Footer.tsx` (it still references removed `BRAND.footer.links`) — this is expected; Task 11 fixes it. Do NOT commit until Task 11 passes.

### Task 11: Footer rebuild

**Files:**
- Modify: `components/Footer.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `components/Footer.tsx`**

```tsx
import Link from "next/link"
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import BrandMark from "@/components/BrandMark"
import { BRAND } from "@/lib/brand"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-espresso text-espresso-foreground">
      <div
        aria-hidden
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.5), transparent)",
        }}
      />
      <div className="container mx-auto px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <BrandMark size={30} />
              <span className="font-display text-xl font-bold italic text-white">
                {BRAND.name}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">{BRAND.footer.tagline}</p>
            <div className="mt-5 flex gap-2.5">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: MessageCircle, label: "WhatsApp", href: "#" },
                { icon: Mail, label: "Email", href: `mailto:${BRAND.contact.email}` },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold/60 hover:text-gold-light"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
              Jelajahi
            </h3>
            <ul className="space-y-2.5">
              {BRAND.footer.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
              Perusahaan
            </h3>
            <ul className="space-y-2.5">
              {BRAND.footer.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold/80" />
                {BRAND.contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0 text-gold/80" />
                {BRAND.contact.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0 text-gold/80" />
                {BRAND.contact.phone}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit (brand.ts + Footer together)**

```bash
git add lib/brand.ts components/Footer.tsx
git commit -m "feat(ui): rebuild Footer — espresso panel, 4 columns, gold accents"
```

### Task 12: Stage 2 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all PASS.

- [ ] **Step 2: Manual visual check**

Run `pnpm dev`, open `/` in light AND dark mode: Navbar (BrandMark, gold hairline on scroll), Footer (espresso 4-col), PropertyCard (Fraunces price, bronze/glass pills).

---

## Stage 3 — Homepage

### Task 13: HeroSection refine

**Files:**
- Modify: `components/HeroSection.tsx`

- [ ] **Step 1: Apply edits**

a) Top gold line — replace the gradient `background` value (currently `rgba(139,75,22,0.7)` based):

```tsx
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.55) 40%, oklch(0.72 0.09 78 / 0.55) 60%, transparent)",
```

b) Headline italic middle line — replace the `<span className="block text-brown-400" style={{ fontStyle: "italic", fontSize: "1.08em" }}>` with:

```tsx
          <span className="block italic text-gold-light" style={{ fontSize: "1.08em" }}>
            {BRAND.headline[1]}
          </span>
```

c) Subtitle readability — change `text-white/55` to `text-white/65`.

d) Replace the entire bottom wave block (`{/* ── Bottom wave transition to page bg ── */}` div including its SVG) with:

```tsx
      {/* ── Bottom gold hairline ──────────────────────────── */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.45), transparent)",
        }}
      />
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/HeroSection.tsx
git commit -m "feat(ui): hero — gold hairlines, warm overlays, remove wave"
```

### Task 14: HeroSearchForm ivory glass

**Files:**
- Modify: `components/HeroSearchForm.tsx`

- [ ] **Step 1: Replace the returned JSX (keep all logic/state identical)**

```tsx
  return (
    <form onSubmit={handleSearch} className="hero-animate-search w-full max-w-lg mb-5">
      <div className="relative flex items-stretch overflow-hidden rounded-2xl bg-background/95 shadow-luxe backdrop-blur-md">
        <div
          aria-hidden
          className="absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        />
        <div className="flex flex-1 items-center gap-2.5 px-4 min-w-0">
          <MapPin size={15} className="text-brown-600 shrink-0" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cari kota atau kawasan..."
            className="flex-1 py-4 text-[13px] font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/70 min-w-0"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="hidden sm:block px-3 bg-transparent border-l border-border/70 text-[13px] text-muted-foreground font-medium outline-none cursor-pointer shrink-0 hover:bg-muted/60 transition-colors"
        >
          <option value="">Semua Tipe</option>
          <option value="rumah">Rumah</option>
          <option value="apartemen">Apartemen</option>
          <option value="tanah">Tanah</option>
          <option value="ruko">Ruko</option>
        </select>

        <button
          type="submit"
          className="btn-press flex items-center gap-2 px-5 sm:px-6 bg-brown-500 hover:bg-brown-600 active:bg-brown-700 text-white text-[13px] font-bold tracking-wide transition-colors duration-150 shrink-0"
        >
          <Search size={15} />
          <span className="hidden sm:block">Cari</span>
        </button>
      </div>
    </form>
  )
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/HeroSearchForm.tsx
git commit -m "feat(ui): hero search bar — ivory glass, gold hairline, warm fields"
```

### Task 15: HeroPropertyTypePills — kill emoji

**Files:**
- Modify: `components/HeroPropertyTypePills.tsx` (full rewrite)

- [ ] **Step 1: Rewrite file**

```tsx
import Link from "next/link"
import { Home, Building2, TreePalm, Store, type LucideIcon } from "lucide-react"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants"

const PROPERTY_TYPE_ICONS: Record<string, LucideIcon> = {
  rumah: Home,
  apartemen: Building2,
  tanah: TreePalm,
  ruko: Store,
}

export default function HeroPropertyTypePills() {
  return (
    <div className="hero-animate-pills mb-9 flex flex-wrap justify-center gap-2">
      {PROPERTY_TYPES.map((t) => {
        const Icon = PROPERTY_TYPE_ICONS[t]
        return (
          <Link
            key={t}
            href={`/properti?type=${t}`}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm transition-all duration-200 hover:border-gold/60 hover:bg-white/20 hover:text-gold-light"
          >
            <Icon size={12} strokeWidth={2.25} />
            <span>{PROPERTY_TYPE_LABELS[t]}</span>
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/HeroPropertyTypePills.tsx
git commit -m "feat(ui): hero type pills — lucide icons instead of emoji"
```

### Task 16: HeroStats polish

**Files:**
- Modify: `components/HeroStats.tsx`

- [ ] **Step 1: Replace the label paragraph**

Replace `<p className="text-white/40 text-[11px] mt-0.5 tracking-wide">{label}</p>` with:

```tsx
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {label}
            </p>
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit`

```bash
git add components/HeroStats.tsx
git commit -m "feat(ui): hero stats — uppercase tracked labels"
```

### Task 17: ExploreTypes editorial redesign

**Files:**
- Modify: `components/ExploreTypes.tsx` (full rewrite, becomes async with count query)

- [ ] **Step 1: Rewrite file**

```tsx
import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { and, eq, isNull, count } from "drizzle-orm"
import { Home, Building2, TreePalm, Store, ArrowUpRight, type LucideIcon } from "lucide-react"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

const ICONS: Record<string, LucideIcon> = {
  rumah: Home,
  apartemen: Building2,
  tanah: TreePalm,
  ruko: Store,
}

async function getTypeCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ type: properties.type, total: count() })
    .from(properties)
    .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))
    .groupBy(properties.type)
  return Object.fromEntries(rows.map((r) => [r.type, r.total]))
}

export default async function ExploreTypes() {
  const counts = await getTypeCounts()

  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Kategori"
        title={BRAND.exploreTypes.heading}
        subtitle="Temukan tipe properti yang paling sesuai dengan kebutuhanmu"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {PROPERTY_TYPES.map((type, i) => {
          const Icon = ICONS[type]
          return (
            <Reveal key={type} delay={i * 80}>
              <Link
                href={`/properti?type=${type}`}
                className="group flex h-full flex-col items-start gap-8 rounded-3xl bg-secondary/60 p-6 transition-all duration-300 hover:bg-brown-500 sm:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brown-100 text-brown-700 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-gold-light">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="mt-auto w-full">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-white">
                      {PROPERTY_TYPE_LABELS[type]}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-brown-500 opacity-0 transition-all duration-300 group-hover:text-gold-light group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 group-hover:text-white/60">
                    {counts[type] ?? 0} listing
                  </span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: PASS (build confirms async server component + drizzle `count()` compile).

```bash
git add components/ExploreTypes.tsx
git commit -m "feat(ui): ExploreTypes editorial cards with listing counts"
```

### Task 18: CTABanner component

**Files:**
- Create: `components/CTABanner.tsx`

- [ ] **Step 1: Create file**

```tsx
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-espresso">
      <div className="absolute inset-0">
        <Image
          src={BRAND.cta.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-espresso/40" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.5), transparent)",
        }}
      />
      <div className="container relative mx-auto px-4 py-20 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              <span aria-hidden className="h-px w-6 bg-gold/70" />
              {BRAND.tagline}
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {BRAND.cta.heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              {BRAND.cta.subheading}
            </p>
            <Link
              href="/properti"
              className="btn-press mt-8 inline-flex items-center gap-2 rounded-xl bg-brown-500 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white shadow-luxe transition-colors hover:bg-brown-400"
            >
              {BRAND.cta.buttonLabel}
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/CTABanner.tsx
git commit -m "feat(ui): CTABanner — espresso full-width closer with photo bg"
```

### Task 19: Homepage "Properti Terbaru" + section rhythm

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Apply edits**

a) Imports — remove `Button`, add `ArrowRight`, `SectionHeading`, `Reveal`, `CTABanner`:

```tsx
import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import { ArrowRight } from "lucide-react"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import ExploreTypes from "@/components/ExploreTypes"
import PopularCities from "@/components/PopularCities"
import TrustSection from "@/components/TrustSection"
import CTABanner from "@/components/CTABanner"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import type { PropertyWithImages } from "@/lib/types"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"
```

b) Replace the entire "Properti Terbaru" `<section>` and the trailing `<PopularCities /> <TrustSection />` with:

```tsx
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Pilihan Terbaru"
            title="Properti Terbaru"
            subtitle="Listing pilihan yang baru ditambahkan"
            className="mb-0"
          />
          <Link
            href="/properti"
            className="group hidden shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brown-600 transition-colors hover:text-brown-700 sm:inline-flex"
          >
            Lihat Semua
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>Belum ada listing properti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 90}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <PopularCities />
      <TrustSection />
      <CTABanner />
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add app/page.tsx
git commit -m "feat(ui): homepage — section rhythm, reveal stagger, CTA banner"
```

### Task 20: PopularCities bento

**Files:**
- Modify: `components/PopularCities.tsx` (full rewrite, async with city counts)

- [ ] **Step 1: Rewrite file**

```tsx
import Link from "next/link"
import Image from "next/image"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { and, eq, isNull, count } from "drizzle-orm"
import { MapPin } from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/brand"

const BENTO = [
  "col-span-2 row-span-2",
  "col-span-2",
  "",
  "",
  "col-span-2",
  "col-span-2",
]

async function getCityCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ city: properties.city, total: count() })
    .from(properties)
    .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))
    .groupBy(properties.city)
  return Object.fromEntries(rows.map((r) => [r.city.toLowerCase(), r.total]))
}

export default async function PopularCities() {
  const counts = await getCityCounts()

  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading eyebrow="Lokasi" title={BRAND.popularCities.heading} />
      <div className="grid auto-rows-[150px] grid-cols-2 gap-4 md:auto-rows-[190px] md:grid-cols-4">
        {BRAND.popularCities.cities.map((city, i) => (
          <Reveal key={city.name} delay={i * 70} className={cn(BENTO[i % BENTO.length])}>
            <Link
              href={`/properti?city=${city.name}`}
              className="group relative block h-full w-full overflow-hidden rounded-3xl"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="flex items-center gap-1.5 font-display text-lg font-semibold italic text-white">
                  <MapPin size={14} className="text-gold" />
                  {city.name}
                </p>
                <p className="mt-0.5 pl-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {counts[city.name.toLowerCase()] ?? 0} properti
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add components/PopularCities.tsx
git commit -m "feat(ui): PopularCities bento grid with property counts"
```

### Task 21: TrustSection bare columns

**Files:**
- Modify: `components/TrustSection.tsx` (full rewrite)

- [ ] **Step 1: Rewrite file**

```tsx
import { Building, Search, Shield } from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/brand"

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  Building,
  Search,
  Shield,
}

export default function TrustSection() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading eyebrow="Keunggulan" title={BRAND.trust.heading} />
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
        {BRAND.trust.items.map((item, i) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <Reveal key={item.title} delay={i * 100}>
              <div
                className={cn(
                  "flex flex-col items-center px-8 text-center",
                  i > 0 && "md:border-l md:border-border/60",
                )}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-brown-600">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/TrustSection.tsx
git commit -m "feat(ui): TrustSection — bare editorial columns, gold-ring icons"
```

### Task 22: Stage 3 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all PASS.

- [ ] **Step 2: Manual visual check**

Run `pnpm dev`, verify `/` end-to-end in both themes: hero (warm overlay, ivory glass search, lucide pills), categories, terbaru, cities bento, trust, CTA banner → footer.

---

## Stage 4 — Catalog, Detail, Map

### Task 23: Catalog page

**Files:**
- Modify: `app/properti/page.tsx`

- [ ] **Step 1: Apply edits**

a) Imports — add `Link`, `SearchX`, `SectionHeading`, and `SheetClose`:

```tsx
import Link from "next/link"
```
```tsx
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
```
```tsx
import { SlidersHorizontal, SearchX } from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
```

b) Replace `PropertyGridSkeleton`:

```tsx
function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {SKELETON_CARDS.map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="skeleton-shimmer h-56 w-full rounded-2xl" />
          <Skeleton className="skeleton-shimmer h-4 w-24 rounded-md" />
          <Skeleton className="skeleton-shimmer h-4 w-full rounded-md" />
          <Skeleton className="skeleton-shimmer h-4 w-32 rounded-md" />
        </div>
      ))}
    </div>
  )
}
```

c) Replace the empty state inside `PropertyGrid`:

```tsx
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
          <SearchX size={22} className="text-brown-600" />
        </div>
        <p className="font-display text-xl font-semibold text-foreground">
          Tidak ada properti yang cocok
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">Coba ubah atau hapus beberapa filter.</p>
        <Button variant="outline" className="mt-5 rounded-xl" asChild>
          <Link href="/properti">Reset Filter</Link>
        </Button>
      </div>
    )
  }
```

d) Replace the result-count paragraph:

```tsx
      <p className="mb-5 text-sm text-muted-foreground">
        <span className="font-display text-lg font-semibold italic text-brown-600">
          {items.length}
        </span>{" "}
        properti ditemukan
      </p>
```

Also change the grid `gap-4` to `gap-5` in that same component.

e) Replace the page header `<h1 className="text-2xl font-bold mb-6">{BRAND.pageTitle.catalogHeading}</h1>` (and bump the container `py-8` to `py-10`):

```tsx
    <div className="container mx-auto px-4 py-10">
      <SectionHeading
        align="left"
        eyebrow="Katalog"
        title={BRAND.pageTitle.catalogHeading}
        subtitle="Telusuri semua listing properti aktif di seluruh Indonesia"
        className="mb-8"
      />
```

f) Mobile sheet — replace `<SheetTitle>Filter Properti</SheetTitle>` and the filter wrapper:

```tsx
              <SheetTitle className="font-display text-xl">Filter Properti</SheetTitle>
```
```tsx
            <div className="py-4">
              <Suspense>
                <PropertyFilter />
              </Suspense>
              <SheetClose asChild>
                <Button className="mt-5 w-full rounded-xl">Lihat Hasil</Button>
              </SheetClose>
            </div>
```

g) Desktop filter panel — replace the aside wrapper:

```tsx
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20 rounded-3xl bg-secondary/60 p-6">
            <Suspense>
              <PropertyFilter />
            </Suspense>
          </div>
        </aside>
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add app/properti/page.tsx
git commit -m "feat(ui): catalog page — SectionHeading, taupe filter panel, warm empty state"
```

### Task 24: PropertyFilter retheme

**Files:**
- Modify: `components/PropertyFilter.tsx`

- [ ] **Step 1: Apply edits**

a) Header — replace the `<h2 className="font-semibold flex items-center gap-2">` block:

```tsx
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-brown-600" />
          Filter
        </h2>
```

b) Reset button — replace its className with `"h-7 text-xs text-brown-600 hover:text-brown-700"`.

c) All six `<Label className="text-xs text-muted-foreground mb-1 block">` →

```tsx
<Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
```

d) All four `SelectTrigger className="h-8 text-sm"` → `SelectTrigger className="h-10 rounded-xl border-border/70 bg-card text-sm"`. Both `Input ... className="h-8 text-sm"` → `className="h-10 rounded-xl border-border/70 bg-card text-sm"`.

e) Outer wrapper `space-y-4` → `space-y-5`; inner fields wrapper `space-y-3` → `space-y-4`.

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/PropertyFilter.tsx
git commit -m "feat(ui): filter panel — uppercase labels, warm rounded inputs"
```

### Task 25: PropertySpecs strip

**Files:**
- Modify: `components/PropertySpecs.tsx` (full rewrite)

- [ ] **Step 1: Rewrite file**

```tsx
import { BedDouble, Bath, Maximize2, type LucideIcon } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number | null
  bathrooms: number | null
  buildingArea: number | null
  landArea: number | null
}

export default function PropertySpecs({
  bedrooms,
  bathrooms,
  buildingArea,
  landArea,
}: PropertySpecsProps) {
  const items = [
    bedrooms != null && { icon: BedDouble, value: `${bedrooms}`, label: "Kamar Tidur" },
    bathrooms != null && { icon: Bath, value: `${bathrooms}`, label: "Kamar Mandi" },
    buildingArea != null && { icon: Maximize2, value: `${buildingArea} m²`, label: "Luas Bangunan" },
    landArea != null && { icon: Maximize2, value: `${landArea} m²`, label: "Luas Tanah" },
  ].filter(Boolean) as { icon: LucideIcon; value: string; label: string }[]

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-y-6 rounded-2xl bg-secondary/50 px-4 py-6 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-border/60">
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1 px-3 text-center">
          <Icon size={16} strokeWidth={1.75} className="mb-1 text-brown-500" />
          <p className="font-display text-xl font-semibold text-foreground">{value}</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit`

```bash
git add components/PropertySpecs.tsx
git commit -m "feat(ui): PropertySpecs — magazine spec strip with hairline dividers"
```

### Task 26: AgentCard panel

**Files:**
- Modify: `components/AgentCard.tsx` (full rewrite)

- [ ] **Step 1: Rewrite file**

```tsx
import { Button } from "@/components/ui/button"
import { Phone, Calendar } from "lucide-react"

interface Agent {
  fullName: string
  phone: string | null
}

interface AgentCardProps {
  agent: Agent | null
  createdAt: Date | null
}

export default function AgentCard({ agent, createdAt }: AgentCardProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-20 space-y-5 rounded-3xl bg-secondary/60 p-6">
        <h3 className="font-display text-lg font-semibold">Hubungi Agen</h3>
        {agent ? (
          <>
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brown-500 font-display text-lg font-semibold text-white ring-2 ring-gold/50">
                {agent.fullName[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display font-semibold leading-tight">
                  {agent.fullName}
                </p>
                {agent.phone && (
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{agent.phone}</p>
                )}
              </div>
            </div>
            {agent.phone && (
              <Button className="btn-press w-full rounded-xl" asChild>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Info agen tidak tersedia</p>
        )}
        <div className="flex items-center gap-1.5 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Diposting{" "}
            {createdAt
              ? new Date(createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit`

```bash
git add components/AgentCard.tsx
git commit -m "feat(ui): AgentCard — warm taupe panel, gold-ring agent avatar"
```

### Task 27: Detail page title block & headings

**Files:**
- Modify: `app/properti/[id]/page.tsx`
- Possibly modify: `components/PropertyMap.tsx` (only if it has its own rounded border — check first)

- [ ] **Step 1: Apply edits**

a) Imports — add `PropertyPills` (keep `Badge` for the sold/rented status):

```tsx
import PropertyPills from "@/components/PropertyPills"
```

b) After `const formattedPrice = formatPriceFull(property.price, property.listingType)`, add:

```tsx
  const priceBase = formatPriceFull(property.price, "jual")
```

c) Replace the entire title block (`<div className="space-y-2">` … `</div>` right before the first `<Separator />`):

```tsx
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <PropertyPills listingType={property.listingType} type={property.type} />
              {property.status !== "active" && (
                <Badge variant="destructive">
                  {property.status === "sold" ? "Terjual" : "Tersewa"}
                </Badge>
              )}
            </div>
            <p className="font-display text-3xl font-semibold text-brown-600 sm:text-4xl">
              {priceBase}
              {property.listingType === "sewa" && (
                <span className="ml-1 text-base font-normal text-muted-foreground">/bulan</span>
              )}
            </p>
            <h1 className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="text-brown-500" />
              <span>
                {property.address ? `${property.address}, ` : ""}
                {property.city}
              </span>
            </div>
          </div>
```

Note: this fixes the double `/bulan` bug (`formatPriceFull` already appends `/bulan` for sewa; the old markup appended another). `formattedPrice` remains used by `generateMetadata` — do not remove it.

d) Description heading — replace `<h2 className="font-semibold mb-2">Deskripsi</h2>`:

```tsx
                <h2 className="mb-3 font-display text-xl font-semibold">Tentang Properti Ini</h2>
```

e) Location heading — replace `<h2 className="font-semibold mb-3">Lokasi</h2>`:

```tsx
                <h2 className="mb-3 font-display text-xl font-semibold">Lokasi</h2>
```

f) Map container — wrap `<PropertyMap ... />`:

```tsx
                  <div className="overflow-hidden rounded-2xl border border-border/60">
                    <PropertyMap
                      lat={parseFloat(property.lat)}
                      lng={parseFloat(property.lng)}
                      title={property.title}
                    />
                  </div>
```

If `components/PropertyMap.tsx` already renders its own outer `rounded-*`/`border` classes, remove them there to avoid doubled borders (keep the map itself untouched otherwise).

g) Google Maps button — change to:

```tsx
                  <Button variant="ghost" size="sm" className="mt-3 w-full rounded-xl text-brown-600 hover:text-brown-700" asChild>
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test`

```bash
git add app/properti/[id]/page.tsx components/PropertyMap.tsx
git commit -m "feat(ui): detail page — Fraunces price-first block, warm headings; fix double /bulan"
```

### Task 28: Map popup retheme

**Files:**
- Modify: `components/LeafletMapView.tsx` (popup markup only, ~lines 51–65)

- [ ] **Step 1: Restyle the Popup inner div**

Keep the existing price expression and link href exactly as they are; change only classNames:

```tsx
            <Popup>
              <div className="min-w-36 space-y-1">
                <p className="font-display text-sm font-semibold leading-tight">{prop.title}</p>
                <p className="font-display text-sm font-semibold text-brown-600">
                  {/* existing price expression — unchanged */}
                </p>
                <p className="text-xs text-stone-500">{prop.city}</p>
                <a
                  /* existing href — unchanged */
                  className="mt-1 block text-xs font-semibold text-brown-600 hover:underline"
                >
                  Lihat Detail →
                </a>
              </div>
            </Popup>
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/LeafletMapView.tsx
git commit -m "feat(ui): map popup — Fraunces title/price, bronze link"
```

### Task 29: Stage 4 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all PASS.

- [ ] **Step 2: Manual visual check**

`pnpm dev`: `/properti` (filter panel, empty state via absurd filter), one `/properti/[id]` (price block, specs strip, agent card, gallery, map), `/peta` (popup). Both themes.

---

## Stage 5 — Auth, Profile, Final Polish

### Task 30: AuthShell + /masuk redesign

**Files:**
- Create: `components/AuthShell.tsx`
- Modify: `app/masuk/page.tsx`

- [ ] **Step 1: Create `components/AuthShell.tsx`**

```tsx
import Image from "next/image"
import Link from "next/link"
import BrandMark from "@/components/BrandMark"
import { BRAND } from "@/lib/brand"

interface AuthShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=1600&fit=crop&auto=format&q=80"
          alt={BRAND.heroImageAlt}
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--hero-overlay-medium), var(--hero-overlay-dark))",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark size={30} />
            <span className="font-display text-xl font-bold italic text-white">{BRAND.name}</span>
          </Link>
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              <span aria-hidden className="h-px w-6 bg-gold/70" />
              {BRAND.tagline}
            </p>
            <p className="max-w-md font-display text-4xl font-semibold leading-tight text-white">
              {BRAND.headline[0]}{" "}
              <span className="italic text-gold-light">{BRAND.headline[1]}</span>{" "}
              {BRAND.headline[2]}
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-flex lg:hidden">
              <BrandMark size={36} />
            </Link>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite the return JSX of `app/masuk/page.tsx`**

Keep ALL logic (state, `handleSubmit`) identical. Remove the `Card*` imports. Replace the `return (...)`:

```tsx
  return (
    <AuthShell title="Masuk" description={BRAND.loginDescription}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="kamu@email.com"
            className="h-11 rounded-xl bg-card"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 rounded-xl bg-card"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className="btn-press h-11 w-full rounded-xl text-[13px] font-bold tracking-wide"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-brown-600 underline-offset-4 hover:underline">
          Daftar
        </Link>
      </p>
    </AuthShell>
  )
```

Also add the import: `import AuthShell from "@/components/AuthShell"`.

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/AuthShell.tsx app/masuk/page.tsx
git commit -m "feat(ui): split-screen auth — AuthShell + Masuk redesign"
```

### Task 31: /daftar redesign

**Files:**
- Modify: `app/daftar/page.tsx`

- [ ] **Step 1: Rewrite the return JSX (keep all logic identical)**

Remove the `Card*` imports, add `import AuthShell from "@/components/AuthShell"`. Replace `return (...)`:

```tsx
  return (
    <AuthShell title="Daftar Akun" description={BRAND.registerDescription}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Nama Lengkap
          </Label>
          <Input
            id="name"
            placeholder="Nama kamu"
            className="h-11 rounded-xl bg-card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="kamu@email.com"
            className="h-11 rounded-xl bg-card"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 karakter"
            className="h-11 rounded-xl bg-card"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className="btn-press h-11 w-full rounded-xl text-[13px] font-bold tracking-wide"
          disabled={loading}
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-brown-600 underline-offset-4 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthShell>
  )
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add app/daftar/page.tsx
git commit -m "feat(ui): Daftar redesign with AuthShell"
```

### Task 32: /profil redesign

**Files:**
- Modify: `app/profil/page.tsx`

- [ ] **Step 1: Apply edits**

a) Imports — remove `Card, CardHeader, CardTitle`, add `Heart`:

```tsx
import { Camera, Loader2, Heart } from "lucide-react"
```

b) Replace the profile header `<Card>...</Card>` block with:

```tsx
      <div className="flex items-center gap-5">
        <div className="relative group shrink-0">
          <Avatar className="h-20 w-20 ring-2 ring-gold/50" size="lg">
            {userImage ? (
              <AvatarImage src={userImage} alt={session.user.name ?? ""} />
            ) : null}
            <AvatarFallback className="text-2xl">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity ${
            uploading ? "opacity-100 bg-brown-500/60" : "opacity-0 group-hover:opacity-100 bg-brown-400/40"
          }`}>
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <UploadButton<OurFileRouter, "profileImage">
                endpoint="profileImage"
                onUploadBegin={() => setUploading(true)}
                onClientUploadComplete={(res) => {
                  setUploading(false)
                  const url = res?.[0]?.ufsUrl
                  if (url) saveAvatar(url)
                }}
                onUploadError={(err) => {
                  setUploading(false)
                  toast.error(`Upload gagal: ${err.message}`)
                }}
                appearance={{
                  button: "h-20 w-20 rounded-full flex items-center justify-center bg-transparent hover:bg-transparent ut-ready:bg-transparent ut-uploading:bg-transparent",
                  container: "",
                  allowedContent: "hidden",
                }}
                content={{
                  button: <Camera size={18} className="text-white" />,
                }}
              />
            )}
          </div>
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{session.user.name}</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-brown-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brown-600">
            {session.user.role ?? "buyer"}
          </span>
        </div>
      </div>
```

(Note the UploadButton size class changed `h-14 w-14` → `h-20 w-20` to match the larger avatar.)

c) Replace the favorites section header and empty state:

```tsx
      <div className="border-t border-border/60 pt-8">
        <p className="mb-1.5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brown-600">
          <span aria-hidden className="h-px w-6 bg-gold/70" />
          Favorit Saya
        </p>
        <h2 className="mb-5 font-display text-xl font-semibold">Properti Favorit</h2>
        {loadingFavs ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="skeleton-shimmer h-64 rounded-2xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl bg-secondary/50 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
              <Heart size={22} className="text-brown-600" />
            </div>
            <p className="font-display text-lg font-semibold">Belum ada favorit</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Simpan properti yang kamu sukai di sini.
            </p>
            <Button className="mt-5 rounded-xl" asChild>
              <Link href="/properti">Jelajahi Properti</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add app/profil/page.tsx
git commit -m "feat(ui): profile — Fraunces header, gold-ring avatar, warm favorites"
```

### Task 33: Final verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all PASS. Confirm test count grew by +4 (Reveal ×2, SectionHeading ×2).

- [ ] **Step 2: Full manual sweep (both themes, mobile + desktop widths)**

- `/` — hero, categories, terbaru, cities, trust, CTA, footer
- `/properti` — filter, grid, empty state
- `/properti/[id]` — gallery, price block, specs, agent card, map
- `/peta` — popups
- `/masuk`, `/daftar` — split-screen (resize to mobile to check banner collapse)
- `/profil` — login required; header + favorites
- `/admin` — confirm UNCHANGED and still functional (brown scale kept)

- [ ] **Step 3: Update AGENTS.md**

Add to the "Key Conventions & Gotchas" section:

```markdown
- **Design tokens** — Warm luxury system: bronze `--primary` + `--color-gold`/`--color-espresso` static tokens + `--shadow-luxe*` in `app/globals.css`. Display font = Fraunces (`font-display` utility, auto-generated from `--font-display`), body = Jost. Never hardcode hex colors or legacy vars.
- **UI primitives** — `components/Reveal.tsx` (scroll reveal), `SectionHeading.tsx` (eyebrow+title), `BrandMark.tsx` (logo), `PropertyPills.tsx` (Dijual/Disewa badges). Use these instead of ad-hoc markup.
```

```bash
git add AGENTS.md
git commit -m "docs: document warm luxury token system and UI primitives"
```

---

## Self-Review Results (plan author)

**Spec coverage:**
- Foundation tokens/fonts/radius/shadows/cleanup → Tasks 1–2 ✓
- Motion primitive `Reveal` → Task 4 ✓
- `SectionHeading` → Task 5 ✓; Navbar → 9; Footer → 10–11; PropertyCard → 7–8 ✓
- Homepage: hero refine → 13–16; ExploreTypes → 17; Terbaru → 19; Cities bento → 20; Trust → 21; CTA banner → 18 ✓
- Catalog → 23–24; Detail → 25–27; Map → 28 ✓
- Auth → 30–31; Profile → 32 ✓
- Dark mode counterparts → Task 1 (.dark block) + manual checks per gate ✓
- AGENTS.md update → Task 33 ✓

**Deviations recorded in header** — hero-overlay vars kept, no favorite button, double-`/bulan` fix, placeholder contact info. ✓

**Placeholder scan:** no TBD/TODO; every code step contains complete code. Tasks 27/28 intentionally say "keep existing expression/href unchanged" for fragments whose originals are quoted in context — acceptable because edits are className-only.

**Type consistency:** `Reveal` props (`children/className/delay`) used identically in Tasks 17/19/20/21 + CTABanner; `SectionHeading` props (`eyebrow/title/subtitle/align/className`) consistent in Tasks 17/19/20/21/23; `PropertyPills` props (`listingType/type/className`) consistent in Tasks 8/27; `BrandMark` (`size/className`) consistent in Tasks 9/11/30; BRAND keys (`footer.explore/company`, `contact.*`, `cta.*`) defined in Task 10 and consumed in Tasks 11/18/30.
