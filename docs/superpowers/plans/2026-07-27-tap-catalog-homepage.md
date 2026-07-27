# TAP CATALOG Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing "Warm Luxury / Resort" direction with a bold, reference-driven redesign (saddle brown, Poppins/Manrope, light-only) using the user's `web tap catalog.svg` wireframe as the visual source of truth. Brand: **TAP CATALOG**. Realign all public pages: homepage (6 sections), catalog, detail, map, auth, profile.

**Architecture:** Token-first rebuild — `globals.css` rewritten with saddle brown primary + light-only (no dark mode), fonts swapped to Poppins (display/body) + Manrope (navbar), `lib/brand.ts` updated to TAP CATALOG. Then shared components (BrandMark, Navbar, Footer, PropertyCard, primitives). Then homepage sections. Then catalog/detail/map restyle. Then auth/profile. TDD only on testable primitives (Reveal, SectionHeading, BrandMark, HowWeWork, ContactSection); rest is presentational rewrites verified visually.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (CSS-first config), next/font/google (Poppins + Manrope), lucide-react, sonner, Drizzle ORM, Neon Postgres, NextAuth v4, Jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-27-tap-catalog-homepage-design.md`

**Supersedes:** `docs/superpowers/plans/2026-07-26-premium-ui-redesign.md` (the old premium plan; do NOT execute).

**Verification order (every gate):** `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`

---

## Stage 1 — Foundation

### Task 1: Rewrite design tokens in `app/globals.css`

**Files:**
- Modify: `app/globals.css` (lines 1–174 — everything through `@layer utilities`; keep all `@keyframes` and animation utility classes below line 175 unchanged)

- [ ] **Step 1: Replace the token sections (lines 1–174) with the following**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
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
  --color-gold: var(--gold);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(0.99 0.005 80);
  --foreground: oklch(0.18 0.005 60);
  --card: oklch(0.99 0.005 80);
  --card-foreground: oklch(0.18 0.005 60);
  --popover: oklch(0.99 0.005 80);
  --popover-foreground: oklch(0.18 0.005 60);
  --primary: oklch(0.45 0.12 40);
  --primary-foreground: oklch(0.99 0.005 80);
  --secondary: oklch(0.95 0.008 70);
  --secondary-foreground: oklch(0.18 0.005 60);
  --muted: oklch(0.95 0.005 75);
  --muted-foreground: oklch(0.45 0.008 60);
  --accent: oklch(0.18 0.005 60);
  --accent-foreground: oklch(0.99 0.005 80);
  --destructive: oklch(0.55 0.20 25);
  --border: oklch(0.88 0.008 70);
  --input: oklch(0.94 0.008 70);
  --ring: oklch(0.45 0.12 40);
  --radius: 0.875rem;
  --gold: oklch(0.72 0.09 78);
  --sidebar: oklch(0.965 0.005 80);
  --sidebar-foreground: oklch(0.18 0.005 60);
  --sidebar-primary: oklch(0.45 0.12 40);
  --sidebar-primary-foreground: oklch(0.99 0.005 80);
  --sidebar-accent: oklch(0.95 0.008 70);
  --sidebar-accent-foreground: oklch(0.18 0.005 60);
  --sidebar-border: oklch(0.88 0.008 70);
  --sidebar-ring: oklch(0.45 0.12 40);
  --chart-1: oklch(0.45 0.12 40);
  --chart-2: oklch(0.18 0.005 60);
  --chart-3: oklch(0.45 0.008 60);
  --chart-4: oklch(0.65 0.005 65);
  --chart-5: oklch(0.85 0.005 72);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

@layer utilities {
  .font-display {
    font-family: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  }
  .text-outline {
    color: transparent;
    -webkit-text-stroke: 2px var(--primary);
  }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `pnpm exec tsc --noEmit`
Expected: may show errors from `dark:` variants elsewhere — those are removed in Task 3, not here. Confirm CSS itself is valid by checking the Next.js dev server starts.

Run: `pnpm dev` in another terminal, open `http://localhost:3000`. Page should still render (still in old style, but no crash).
Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(ui): rewrite tokens — saddle brown primary, off-white bg, light-only"
```

### Task 2: Swap fonts to Poppins + Manrope in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the import line (line 3) and font definitions (lines 11–17)**

```tsx
import type { Metadata } from "next"
import { Poppins, Manrope } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import ConditionalFooter from "@/components/ConditionalFooter"
import Providers from "@/components/Providers"
import { BRAND } from "@/lib/brand"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})
```

- [ ] **Step 2: Update the `<html>` tag (line 26)**

```tsx
    <html lang="id" className={`${poppins.variable} ${manrope.variable}`}>
```

(Removed `suppressHydrationWarning` — no longer needed without dark-mode class toggling.)

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: build PASSES (Google Fonts fetched at build time; if no network in sandbox, surface to user — do NOT work around with local fonts).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(ui): swap Geist/Cormorant for Poppins/Manrope, drop hydration warning"
```

### Task 3: Drop dark mode (ThemeProvider + ThemeToggle + `dark:` variants)

**Files:**
- Modify: `components/Providers.tsx`
- Delete: `components/ThemeToggle.tsx`
- Modify: `components/Navbar.tsx` (remove ThemeToggle import & usage)
- Modify: `app/globals.css` (already done in Task 1 — no `.dark` block anymore)
- Strip `dark:` Tailwind variants from every `.tsx`/`.ts` file under `app/`, `components/`, `hooks/`, `lib/`

- [ ] **Step 1: Replace `components/Providers.tsx`**

```tsx
"use client"

import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 2: Delete `components/ThemeToggle.tsx`**

```bash
git rm components/ThemeToggle.tsx
```

- [ ] **Step 3: In `components/Navbar.tsx`, remove the ThemeToggle lines**

Delete line 15: `import ThemeToggle from "@/components/ThemeToggle"`
Delete the `<ThemeToggle />` JSX (line 87) and the empty fragment if it becomes empty.

- [ ] **Step 4: Strip every `dark:` Tailwind variant from the codebase**

Run:
```bash
grep -rEl '(\s|:|")dark:[a-zA-Z0-9_-]+' app components hooks lib --include='*.tsx' --include='*.ts' --include='*.css' | sort -u
```

For each file in the list, remove the `dark:...` class segments. Examples:
- `dark:bg-espresso/90` → remove entire class
- `hover:text-foreground dark:hover:text-white` → keep only `hover:text-foreground`
- `dark:md:bg-accent` → remove entire class
- `dark:[&_h2]:text-white` → remove entire class

The `dark` class on `<html>` and any `theme="dark"` references are gone since the `.dark { }` block was removed in Task 1.

- [ ] **Step 5: Strip `dark:` from `app/globals.css`**

The only place `dark:` could remain in CSS is in custom selectors. Run:
```bash
grep -n 'dark:' app/globals.css
```
Expected: no output (already removed by Task 1's full rewrite).

- [ ] **Step 6: Verify**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS. If build fails on a `dark:` reference, repeat grep and fix.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(ui): drop dark mode — remove ThemeProvider, ThemeToggle, all dark: variants"
```

### Task 4: Update `lib/brand.ts` to TAP CATALOG

**Files:**
- Modify: `lib/brand.ts`

- [ ] **Step 1: Replace the entire `BRAND` object**

```ts
export const BRAND = {
  name: "TAP CATALOG",

  fullName: "TAP CATALOG — Katalog Properti Indonesia",

  tagline: "Katalog Properti #1 Indonesia",

  description: "Katalog properti terlengkap di Indonesia — rumah, apartemen, tanah, dan ruko",

  heroImageAlt: "TAP CATALOG — Katalog Properti Indonesia",

  pageTitle: {
    home: "TAP CATALOG – Katalog Properti Indonesia",
    catalog: "Katalog Properti — TAP CATALOG",
    map: "Peta Properti — TAP CATALOG",
    login: "Masuk — TAP CATALOG",
    register: "Daftar — TAP CATALOG",
    propertyNotFound: "Properti Tidak Ditemukan — TAP CATALOG",
    catalogHeading: "Katalog Properti",
  },

  pageDescription: {
    home: "Temukan rumah, apartemen, tanah, dan ruko terbaik di seluruh Indonesia",
    catalog: "Telusuri katalog properti terverifikasi di seluruh Indonesia",
    register: "Buat akun TAP CATALOG gratis",
    login: "Masuk ke akun TAP CATALOG kamu",
  },

  loginDescription: "Masuk ke akun TAP CATALOG kamu",
  registerDescription: "Buat akun TAP CATALOG gratis",

  exploreTypes: {
    heading: "Jelajahi Tipe Properti",
  },

  popularCities: {
    heading: "Kota Populer",
    cities: [
      { name: "Jakarta", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&h=600&fit=crop&auto=format" },
      { name: "Bandung", image: "https://images.unsplash.com/photo-1707993467310-a5b2bb858d68?w=800&h=600&fit=crop&auto=format" },
      { name: "Surabaya", image: "https://images.unsplash.com/photo-1698139603356-d8c63b9aacce?w=800&h=600&fit=crop&auto=format" },
      { name: "Yogyakarta", image: "https://images.unsplash.com/photo-1722444924699-391078e83ad6?w=800&h=600&fit=crop&auto=format" },
      { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop&auto=format" },
      { name: "Semarang", image: "https://images.unsplash.com/photo-1657594873796-4a121883192a?w=800&h=600&fit=crop&auto=format" },
    ],
  },

  stats: [
    { n: "15.000+", label: "Properti Aktif" },
    { n: "34", label: "Provinsi" },
    { n: "500+", label: "Agen Terpercaya" },
  ] as const,

  howWeWork: {
    heading: "Bagaimana Kami Bekerja",
    subtitle: "Proses mudah menemukan properti yang tepat untuk Anda.",
    steps: [
      {
        icon: "MessageCircle",
        title: "Konsultasi Gratis",
        description: "Konsultasi kebutuhanmu, kami bantu tentukan tipe properti yang sesuai.",
      },
      {
        icon: "Search",
        title: "Cari & Pilih",
        description: "Telusuri katalog terverifikasi, filter sesuai budget dan lokasi.",
      },
      {
        icon: "FileCheck",
        title: "Verifikasi Data",
        description: "Setiap listing melalui proses verifikasi dokumen dan legalitas.",
      },
      {
        icon: "Handshake",
        title: "Hubungi Agen",
        description: "Terhubung langsung dengan agen terpercaya untuk kunjungan & negosiasi.",
      },
    ] as const,
  },

  about: {
    heading: "Tentang TAP CATALOG",
    subtitle:
      "Katalog properti terlengkap untuk menemukan rumah, apartemen, tanah, dan ruko di seluruh Indonesia.",
    body: "TAP CATALOG adalah katalog properti modern yang mempertemukan pembeli, penyewa, dan agen terpercaya di seluruh Indonesia. Kami menyediakan ribuan listing terverifikasi — lengkap dengan foto, spesifikasi, dan lokasi — sehingga Anda dapat membuat keputusan properti dengan percaya diri.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=1100&fit=crop&auto=format&q=80",
  },

  contact: {
    email: "halo@tapcatalog.id",
    phone: "+62 812-3456-7890",
    address: "Jl. Sudirman Kav. 21, Jakarta Selatan",
    hours: "Senin – Jumat, 09.00 – 18.00 WIB",
  },

  social: {
    instagram: "#",
    whatsapp: "#",
    facebook: "#",
  },

  footer: {
    tagline: "Katalog properti terpercaya di seluruh Indonesia",
    explore: [
      { label: "Rumah", href: "/properti?type=rumah" },
      { label: "Apartemen", href: "/properti?type=apartemen" },
      { label: "Tanah", href: "/properti?type=tanah" },
      { label: "Ruko", href: "/properti?type=ruko" },
    ],
    company: [
      { label: "Tentang Kami", href: "/#tentang" },
      { label: "Hubungi Kami", href: "/#kontak" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
} as const

export function brandTitle(title: string): string {
  return `${title} — ${BRAND.name}`
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: FAIL in any file that referenced removed fields (e.g. `BRAND.headline`, `BRAND.footer.links`). These are addressed in later tasks; here we only confirm `lib/brand.ts` itself is valid. Temporarily silence any consumers by replacing references with `BRAND.name` as a placeholder — but better: let the type errors surface and fix them task-by-task as components are rewritten in Stage 2.

- [ ] **Step 3: Commit**

```bash
git add lib/brand.ts
git commit -m "feat(brand): rename to TAP CATALOG, add howWeWork/about/contact/social"
```

### Task 5: Stage 1 verification gate

- [ ] **Step 1: Run full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS (some pre-existing `dark:` references may remain in admin or other files — those are out of scope; fix only public-facing files). If test failures occur in `PropertyCard.test.tsx` due to `Rp 1.0 M` markup change, that's expected and will be fixed in Task 9.

- [ ] **Step 2: Manual visual smoke**

Run `pnpm dev`, open `http://localhost:3000`:
- Hero should render with brown background (old primary brown `#8b4b16` since we still have `bg-brown-500` etc referencing the brown scale; those will be cleaned in Stage 2)
- No console errors
- Page is light-only (no theme toggle)

If a `PropertyCard` test failed in Step 1, mark it `xit`/`test.skip` temporarily with a `// TODO: fix in Task 9` comment. Do NOT commit the skip — fix it properly in Task 9.

---

## Stage 2 — Primitives & Shared Components

### Task 6: Create `Reveal` scroll-reveal component

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

  it('applies transition delay', () => {
    const { container } = render(<Reveal delay={150}>Hi</Reveal>)
    const el = container.firstChild as HTMLElement
    expect(el.style.transitionDelay).toBe('150ms')
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
        "transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
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
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/Reveal.tsx components/Reveal.test.tsx
git commit -m "feat(ui): add Reveal scroll-reveal primitive (350ms, rise 12px)"
```

### Task 7: Create `SectionHeading` component

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

  it('centers by default', () => {
    const { container } = render(<SectionHeading title="A" />)
    expect(container.firstChild).toHaveClass('text-center')
  })

  it('can align left', () => {
    const { container } = render(<SectionHeading title="A" align="left" />)
    expect(container.firstChild).toHaveClass('text-left')
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
            "mb-3 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-primary",
            centered && "justify-center",
          )}
        >
          {centered && <span aria-hidden className="h-px w-6 bg-gold/70" />}
          {eyebrow}
          {centered && <span aria-hidden className="h-px w-6 bg-gold/70" />}
        </p>
      ) : null}
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/SectionHeading.tsx components/SectionHeading.test.tsx
git commit -m "feat(ui): add SectionHeading primitive (Poppins, eyebrow + title + subtitle)"
```

### Task 8: Create `BrandMark` logomark (building icon + TAP + CATALOG)

**Files:**
- Create: `components/BrandMark.tsx`
- Test: `components/BrandMark.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/BrandMark.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import BrandMark from '@/components/BrandMark'

describe('BrandMark', () => {
  it('renders TAP and CATALOG text', () => {
    render(<BrandMark />)
    expect(screen.getByText('TAP')).toBeInTheDocument()
    expect(screen.getByText('CATALOG')).toBeInTheDocument()
  })

  it('renders an svg icon', () => {
    const { container } = render(<BrandMark />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- BrandMark`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/BrandMark.tsx`**

```tsx
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: "sm" | "md" | "lg"
  className?: string
  /** Use off-white text + brown box (e.g. on dark/footer backgrounds) */
  inverted?: boolean
}

const SIZE_MAP = {
  sm: { box: 24, tap: 16, catalog: 9, gap: 8 },
  md: { box: 32, tap: 22, catalog: 11, gap: 10 },
  lg: { box: 44, tap: 30, catalog: 13, gap: 12 },
} as const

export default function BrandMark({ size = "md", className, inverted = false }: BrandMarkProps) {
  const s = SIZE_MAP[size]
  return (
    <span
      className={cn("inline-flex shrink-0 select-none items-center font-sans", className)}
      style={{ gap: s.gap }}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-lg shrink-0",
          inverted ? "bg-primary-foreground" : "bg-primary",
        )}
        style={{ width: s.box, height: s.box }}
      >
        <svg
          viewBox="0 0 24 24"
          width={Math.round(s.box * 0.6)}
          height={Math.round(s.box * 0.6)}
          fill="none"
        >
          <path
            d="M5 8 L19 8 L19 19 L5 19 Z"
            className={inverted ? "stroke-primary" : "stroke-primary-foreground"}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M5 12 L19 12" className={inverted ? "stroke-primary" : "stroke-primary-foreground"} strokeWidth="2" />
          <path d="M5 15.5 L19 15.5" className={inverted ? "stroke-primary" : "stroke-primary-foreground"} strokeWidth="2" />
          <path d="M5 8 L12 4 L19 8" className={inverted ? "stroke-primary" : "stroke-primary-foreground"} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="flex items-baseline gap-1.5 leading-none">
        <span
          className={cn(
            "font-extrabold tracking-tight",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
          style={{ fontSize: s.tap }}
        >
          TAP
        </span>
        <span
          className={cn(
            "font-semibold uppercase tracking-[0.2em]",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
          style={{ fontSize: s.catalog }}
        >
          CATALOG
        </span>
      </span>
    </span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- BrandMark`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/BrandMark.tsx components/BrandMark.test.tsx
git commit -m "feat(ui): add BrandMark — building icon SVG + TAP + CATALOG"
```

### Task 9: Restyle `PropertyPills` (Dijual/Disewa/Type)

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
          "inline-flex items-center rounded-full px-2.5 py-[3px] text-[10px] font-bold tracking-wide shadow-sm",
          isJual
            ? "bg-primary text-primary-foreground shadow-primary/30"
            : "bg-accent text-accent-foreground shadow-black/20",
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

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit`

```bash
git add components/PropertyPills.tsx
git commit -m "feat(ui): add PropertyPills — solid brown/black, no glass"
```

### Task 10: Restyle `PropertyCard` (rewrite)

**Files:**
- Modify: `components/PropertyCard.tsx` (full rewrite)
- Modify: `components/PropertyCard.test.tsx` (price markup change)

- [ ] **Step 1: Update the test FIRST (price markup changes)**

Replace the second test in `components/PropertyCard.test.tsx` with:

```tsx
  it('formats price correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/1\.0 M/)).toBeInTheDocument()
    expect(screen.getByText('Rp')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- PropertyCard`
Expected: FAIL on price test (old markup has `Rp 1.0 M` as a single string, new markup splits into "Rp" + "1.0 M").

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
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3">
          <PropertyPills listingType={property.listingType} type={property.type} />
        </div>
      </div>

      <div className="p-5">
        <p className="mb-1.5 font-sans text-[22px] font-semibold leading-tight text-primary">
          <span className="mr-0.5 align-top text-[0.55em] font-medium text-primary/80">Rp</span>
          {priceMain}
        </p>

        <h3 className="mb-2 line-clamp-1 font-sans text-[16px] font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <MapPin size={11} className="shrink-0 text-primary" />
          <span className="line-clamp-1">{property.address ?? property.city}</span>
        </div>

        {hasSpecs && (
          <div className="mt-3.5 flex items-center gap-3 border-t border-border/60 pt-3 text-[12px] text-muted-foreground">
            {property.type === "tanah" ? (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={11} className="text-primary/70" />
                {property.landArea} m²
              </span>
            ) : (
              <>
                {property.bedrooms != null && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={11} className="text-primary/70" />
                    {property.bedrooms} KT
                  </span>
                )}
                {property.bedrooms != null && property.bathrooms != null && (
                  <span aria-hidden className="h-3 w-px bg-border" />
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-1.5">
                    <Bath size={11} className="text-primary/70" />
                    {property.bathrooms} KM
                  </span>
                )}
                {property.buildingArea != null && property.bathrooms != null && (
                  <span aria-hidden className="h-3 w-px bg-border" />
                )}
                {property.buildingArea != null && (
                  <span className="flex items-center gap-1.5">
                    <Maximize2 size={11} className="text-primary/70" />
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
git commit -m "feat(ui): PropertyCard — Poppins price tag, gold hairline hover, warm tokens"
```

### Task 11: Restyle `Navbar` (Manrope, no toggle, BrandMark, saddle brown active)

**Files:**
- Modify: `components/Navbar.tsx` (full rewrite)

- [ ] **Step 1: Replace the file with**

```tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, ChevronDown, MapPin, LayoutGrid, Home } from "lucide-react"
import BrandMark from "@/components/BrandMark"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/",         label: "Home",     icon: Home },
  { href: "/properti", label: "Properti", icon: LayoutGrid },
  { href: "/peta",     label: "Peta",     icon: MapPin },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <BrandMark size="md" />
        </Link>

        <div className="hidden sm:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative inline-flex items-center gap-2 leading-none",
                  "font-sans text-[14px] font-medium",
                  "transition-colors duration-200",
                  active ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground",
                )}
              >
                <Icon
                  size={14}
                  strokeWidth={2.25}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70",
                  )}
                />
                {label}
                <span
                  className={cn(
                    "absolute -bottom-[1.15rem] left-0 right-0 h-[2px] origin-left transition-transform duration-200",
                    active ? "bg-primary scale-x-100" : "bg-primary scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {session ? (
            <>
              {session.user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[12px] font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <PlusCircle size={13} />
                  Dashboard
                </Link>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="h-7 w-7 rounded-full bg-secondary border-2 border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt=""
                          width={28}
                          height={28}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-bold text-primary">
                          {session.user.name?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      )}
                    </div>
                    <ChevronDown size={12} className="text-foreground/40 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-[13px] font-semibold truncate leading-tight">
                      {session.user.name ?? "Pengguna"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>

                  <DropdownMenuItem asChild className="mt-1 cursor-pointer">
                    <Link href="/profil">Profil &amp; Favorit</Link>
                  </DropdownMenuItem>

                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/masuk"
              className="flex items-center gap-1.5 rounded-xl border border-primary px-3.5 py-2 text-[12px] font-semibold tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {BRAND.name === "TAP CATALOG" ? "Masuk" : "Masuk"}
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/Navbar.tsx
git commit -m "feat(ui): Navbar — Manrope type, BrandMark, saddle brown active, no toggle"
```

### Task 12: Restyle `Footer` (saddle brown panel, 4 columns, gold hairline)

**Files:**
- Modify: `components/Footer.tsx` (full rewrite)

- [ ] **Step 1: Replace the file with**

```tsx
import Link from "next/link"
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import BrandMark from "@/components/BrandMark"
import { BRAND } from "@/lib/brand"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="kontak" className="bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.09 78 / 0.55), transparent)",
        }}
      />
      <div className="container mx-auto px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-flex">
              <BrandMark size="md" inverted />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              {BRAND.footer.tagline}
            </p>
            <div className="mt-5 flex gap-2.5">
              {[
                { icon: Instagram, label: "Instagram", href: BRAND.social.instagram },
                { icon: MessageCircle, label: "WhatsApp", href: BRAND.social.whatsapp },
                { icon: Mail, label: "Email", href: `mailto:${BRAND.contact.email}` },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              Jelajahi
            </h3>
            <ul className="space-y-2.5">
              {BRAND.footer.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              Perusahaan
            </h3>
            <ul className="space-y-2.5">
              {BRAND.footer.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
                {BRAND.contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0 text-gold" />
                {BRAND.contact.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0 text-gold" />
                {BRAND.contact.phone}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 sm:flex-row">
          <p className="text-xs text-primary-foreground/60">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/Footer.tsx
git commit -m "feat(ui): Footer — saddle brown panel, 4 columns, BrandMark inverted, gold accents"
```

### Task 13: Stage 2 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS. Old homepage still uses old ExploreTypes / PopularCities / HeroSection / TrustSection — those are restyled in Stage 3.

- [ ] **Step 2: Manual visual**

Run `pnpm dev`, open `/`:
- Navbar: BrandMark "TAP CATALOG" + nav links in Manrope, "Masuk" outline button. No theme toggle.
- Footer: saddle brown, 4 columns, gold accents.
- PropertyCard (catalog): Poppins price, gold hairline hover.

---

## Stage 3 — Homepage

### Task 14: Restyle `HeroSection` (reference-style: photo + 2 CTAs + Discover/Build headline)

**Files:**
- Modify: `components/HeroSection.tsx` (full rewrite)

- [ ] **Step 1: Replace the file with**

```tsx
"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { BRAND } from "@/lib/brand"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-[78vh] min-h-[560px] max-h-[820px]">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&auto=format&q=80"
        alt={BRAND.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 40%, oklch(0.72 0.09 78 / 0.6) 50%, transparent 60%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <h1 className="font-sans text-white tracking-tight leading-[1.05]">
          <span className="block font-light italic text-3xl sm:text-4xl md:text-5xl">
            Discover Your Mission
          </span>
          <span className="block font-bold text-4xl sm:text-5xl md:text-6xl mt-2">
            Build Our Passion
          </span>
        </h1>

        <p className="mt-5 max-w-md text-sm sm:text-base text-white/70 leading-relaxed">
          {BRAND.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/properti"
            className="btn-press inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            BOOK NOW <span aria-hidden>→</span>
          </a>
          <a
            href="/masuk"
            className="btn-press inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10"
          >
            FOR SELLER
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-1 pointer-events-none">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
            Scroll
          </span>
          <ChevronDown size={16} className="text-white/40" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add components/HeroSection.tsx
git commit -m "feat(ui): hero — reference style, photo + Discover/Build + 2 CTAs"
```

### Task 15: Create `AboutSection` (Tentang + paragraph + photo + 3 stats)

**Files:**
- Create: `components/AboutSection.tsx`
- Test: `components/AboutSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/AboutSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AboutSection from '@/components/AboutSection'

describe('AboutSection', () => {
  it('renders heading, body, and 3 stats', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Tentang TAP CATALOG/)).toBeInTheDocument()
    expect(screen.getByText(/katalog properti modern/)).toBeInTheDocument()
    expect(screen.getByText('15.000+')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- AboutSection`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/AboutSection.tsx`**

```tsx
import Image from "next/image"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

export default function AboutSection() {
  return (
    <section id="tentang" className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Tentang Kami"
        title={BRAND.about.heading}
        subtitle={BRAND.about.subtitle}
      />

      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
            {BRAND.about.body}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <Image
              src={BRAND.about.image}
              alt="Gedung pencakar langit"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 divide-y divide-border sm:mt-16 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {BRAND.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="px-6 py-8 text-center sm:py-2">
              <p className="font-sans text-5xl font-bold text-primary sm:text-6xl">{s.n}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- AboutSection`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add components/AboutSection.tsx components/AboutSection.test.tsx
git commit -m "feat(ui): AboutSection — paragraph + photo + 3 stats"
```

### Task 16: Create `HowWeWork` (4 cards, lucide icons, saddle brown border)

**Files:**
- Create: `components/HowWeWork.tsx`
- Test: `components/HowWeWork.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/HowWeWork.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import HowWeWork from '@/components/HowWeWork'

describe('HowWeWork', () => {
  it('renders heading and 4 step titles', () => {
    render(<HowWeWork />)
    expect(screen.getByText('Bagaimana Kami Bekerja')).toBeInTheDocument()
    expect(screen.getByText('Konsultasi Gratis')).toBeInTheDocument()
    expect(screen.getByText('Cari & Pilih')).toBeInTheDocument()
    expect(screen.getByText('Verifikasi Data')).toBeInTheDocument()
    expect(screen.getByText('Hubungi Agen')).toBeInTheDocument()
  })

  it('renders 4 svg icons', () => {
    const { container } = render(<HowWeWork />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- HowWeWork`
Expected: FAIL.

- [ ] **Step 3: Create `components/HowWeWork.tsx`**

```tsx
import {
  MessageCircle,
  Search,
  FileCheck,
  Handshake,
  type LucideIcon,
} from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

const ICONS: Record<string, LucideIcon> = {
  MessageCircle,
  Search,
  FileCheck,
  Handshake,
}

export default function HowWeWork() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Layanan"
        title={BRAND.howWeWork.heading}
        subtitle={BRAND.howWeWork.subtitle}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BRAND.howWeWork.steps.map((step, i) => {
          const Icon = ICONS[step.icon]
          return (
            <Reveal key={step.title} delay={i * 80}>
              <div className="flex h-full flex-col items-center rounded-2xl border-2 border-primary bg-background p-7 text-center transition-colors hover:bg-primary/5">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-sans text-[17px] font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- HowWeWork`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/HowWeWork.tsx components/HowWeWork.test.tsx
git commit -m "feat(ui): HowWeWork — 4 cards, black icon circles, saddle brown border"
```

### Task 17: Restyle `ExploreTypes` (no emoji, lucide icons, saddle brown border + count)

**Files:**
- Modify: `components/ExploreTypes.tsx` (becomes async for counts)

- [ ] **Step 1: Replace the file with**

```tsx
import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { and, eq, isNull, count } from "drizzle-orm"
import { Home, Building2, TreePalm, Store, type LucideIcon } from "lucide-react"
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
        subtitle="Temukan tipe properti yang paling sesuai dengan kebutuhan Anda"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PROPERTY_TYPES.map((type, i) => {
          const Icon = ICONS[type]
          return (
            <Reveal key={type} delay={i * 80}>
              <Link
                href={`/properti?type=${type}`}
                className="group flex items-center gap-4 rounded-2xl border-2 border-primary p-5 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="flex flex-col">
                  <span className="font-sans text-[16px] font-semibold transition-colors">
                    {PROPERTY_TYPE_LABELS[type]}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
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
git commit -m "feat(ui): ExploreTypes — lucide icons, saddle brown border, listing count"
```

### Task 18: Restyle `PopularCities` (bento layout, MapPin, count, black overlay)

**Files:**
- Modify: `components/PopularCities.tsx` (becomes async with city counts)

- [ ] **Step 1: Replace the file with**

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
      <SectionHeading
        eyebrow="Lokasi"
        title={BRAND.popularCities.heading}
        subtitle="Listing properti di kota-kota besar Indonesia"
      />
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
              <div className="absolute inset-0 bg-gradient-to-t from-accent/85 via-accent/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="flex items-center gap-1.5 font-sans text-lg font-semibold italic text-white">
                  <MapPin size={14} className="text-gold" />
                  {city.name}
                </p>
                <p className="mt-0.5 pl-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/60">
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
git commit -m "feat(ui): PopularCities — bento grid, italic city, gold MapPin, count"
```

### Task 19: Create `ContactSection` (outlined "Contact" word + form + info)

**Files:**
- Create: `components/ContactSection.tsx`
- Test: `components/ContactSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ContactSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import ContactSection from '@/components/ContactSection'

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}))

describe('ContactSection', () => {
  it('renders huge Contact word, form and info', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByText(/halo@tapcatalog\.id/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- ContactSection`
Expected: FAIL.

- [ ] **Step 3: Create `components/ContactSection.tsx`**

```tsx
"use client"

import { useState, type FormEvent } from "react"
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { toast } from "sonner"
import { BRAND } from "@/lib/brand"

export default function ContactSection() {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success("Pesan terkirim! Kami akan menghubungi Anda segera.")
      ;(e.target as HTMLFormElement).reset()
      setSubmitting(false)
    }, 400)
  }

  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/80"
  const inputClass =
    "w-full rounded-xl bg-primary-foreground/95 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-gold"

  return (
    <section className="bg-background pt-16 sm:pt-20">
      <div className="container mx-auto px-4">
        <h2
          aria-hidden
          className="font-sans font-extrabold italic leading-[0.85] tracking-tight text-outline select-none text-center"
          style={{ fontSize: "clamp(5rem, 18vw, 12rem)" }}
        >
          Contact
        </h2>
        <p className="sr-only">Hubungi kami</p>
      </div>

      <div className="mt-4 bg-primary text-primary-foreground rounded-t-3xl">
        <div className="container mx-auto px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-sans text-2xl font-semibold sm:text-3xl">Hubungi Kami</h3>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/70 sm:text-[15px]">
                Tim kami siap membantu menemukan properti yang tepat untuk Anda.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Nama</label>
                  <input id="contact-name" name="name" type="text" required className={inputClass} placeholder="Nama lengkap" />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email</label>
                  <input id="contact-email" name="email" type="email" required className={inputClass} placeholder="nama@email.com" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>No. Telepon</label>
                  <input id="contact-phone" name="phone" type="tel" className={inputClass} placeholder="+62 ..." />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClass}>Pesan</label>
                  <textarea id="contact-message" name="message" required rows={4} className={inputClass} placeholder="Ceritakan kebutuhan properti Anda..." />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-press inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-primary transition-colors hover:bg-gold hover:text-primary disabled:opacity-60"
                >
                  <Send size={14} />
                  Kirim Pesan
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-sans text-lg font-semibold sm:text-xl">Informasi Kontak</h3>
              <ul className="mt-5 space-y-4 text-sm text-primary-foreground/85">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>{BRAND.contact.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-gold" />
                  <a href={`mailto:${BRAND.contact.email}`} className="hover:text-gold">{BRAND.contact.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-gold" />
                  <a href={`tel:${BRAND.contact.phone.replace(/\s/g, "")}`} className="hover:text-gold">{BRAND.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0 text-gold" />
                  <span>{BRAND.contact.hours}</span>
                </li>
              </ul>

              <div className="mt-7 flex gap-3">
                {[
                  { icon: Instagram, label: "Instagram", href: BRAND.social.instagram },
                  { icon: MessageCircle, label: "WhatsApp", href: BRAND.social.whatsapp },
                  { icon: Facebook, label: "Facebook", href: BRAND.social.facebook },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              <a
                href="/peta"
                className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-foreground/85 hover:text-gold"
              >
                Lihat di Peta →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- ContactSection`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add components/ContactSection.tsx components/ContactSection.test.tsx
git commit -m "feat(ui): ContactSection — outlined 'Contact' word + form + info (inert v1)"
```

### Task 20: Restructure `app/page.tsx` to new 6-section homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the file with**

```tsx
import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import { ArrowRight } from "lucide-react"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import HowWeWork from "@/components/HowWeWork"
import ExploreTypes from "@/components/ExploreTypes"
import PopularCities from "@/components/PopularCities"
import ContactSection from "@/components/ContactSection"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import type { PropertyWithImages } from "@/lib/types"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"

export const revalidate = 60

async function getFeaturedProperties(): Promise<PropertyWithImages[]> {
  return getPropertiesWithImagesBatch(
    db
      .select()
      .from(properties)
      .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))
      .orderBy(desc(properties.createdAt))
      .limit(6),
  )
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <div>
      <HeroSection />

      <AboutSection />

      <HowWeWork />

      <section className="container mx-auto px-4 py-16 sm:py-20">
        <SectionHeading
          align="left"
          eyebrow="Listing"
          title="Properti Pilihan"
          subtitle="Listing terbaru dari agen terpercaya di seluruh Indonesia"
        />

        <ExploreTypes />

        <div className="mt-10 flex items-center justify-between">
          <h3 className="font-sans text-lg font-semibold text-foreground sm:text-xl">
            Properti Terbaru
          </h3>
          <Link
            href="/properti"
            className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80"
          >
            Lihat Semua
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Belum ada listing properti.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 90}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <PopularCities />

      <ContactSection />
    </div>
  )
}
```

- [ ] **Step 2: Refactor `components/ExploreTypes.tsx` to drop its own section/header**

Replace the entire file with:

```tsx
import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { and, eq, isNull, count } from "drizzle-orm"
import { Home, Building2, TreePalm, Store, type LucideIcon } from "lucide-react"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import Reveal from "@/components/Reveal"

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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {PROPERTY_TYPES.map((type, i) => {
        const Icon = ICONS[type]
        return (
          <Reveal key={type} delay={i * 80}>
            <Link
              href={`/properti?type=${type}`}
              className="group flex items-center gap-4 rounded-2xl border-2 border-primary p-5 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="flex flex-col">
                <span className="font-sans text-[16px] font-semibold transition-colors">
                  {PROPERTY_TYPE_LABELS[type]}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
                  {counts[type] ?? 0} listing
                </span>
              </span>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
```

(Note: This is the same code as Task 17 — Task 20 effectively supersedes Task 17's section header, but the file rewrite in Task 17 is the same body. If Task 17 was already committed as the version with its own section, this task's edit drops the section wrapper to match the new homepage layout.)

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: PASS.

```bash
git add app/page.tsx components/ExploreTypes.tsx
git commit -m "feat(ui): homepage — Hero → About → HowWeWork → Properti → Cities → Contact"
```

### Task 21: Remove obsolete `TrustSection` (no longer used)

**Files:**
- Delete: `components/TrustSection.tsx`

- [ ] **Step 1: Delete the file**

```bash
git rm components/TrustSection.tsx
```

- [ ] **Step 2: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: PASS (no remaining references).

```bash
git commit -m "refactor(ui): remove TrustSection (replaced by HowWeWork)"
```

### Task 22: Stage 3 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS.

- [ ] **Step 2: Manual visual check**

Run `pnpm dev`, open `http://localhost:3000`. Verify sections in order: Hero (photo + 2 CTAs) → About (paragraph + photo + 3 stats) → How We Work (4 cards) → Properti (4 ExploreTypes + 6 PropertyCards) → Popular Cities (6 bento) → Contact (outlined word + brown panel + form) → Footer (saddle brown 4-col).

---

## Stage 4 — Catalog + Detail + Map

### Task 23: Restyle `PropertyFilter` (warm panel, borderless, saddle brown focus)

**Files:**
- Modify: `components/PropertyFilter.tsx` (surgical edits — file logic stays, only className changes)

- [ ] **Step 1: Update the heading and labels**

Find the existing `<h2 className="font-semibold flex items-center gap-2">` block. Replace it with:
```tsx
        <h2 className="font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          Filter
        </h2>
```

Find every `<Label className="text-xs text-muted-foreground mb-1 block">` (6 instances in the file — one per filter section: Tipe Properti, Jual / Sewa, Kota, Harga Min, Harga Max, Min Kamar Tidur). Replace `text-xs text-muted-foreground` with `text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70`.

- [ ] **Step 2: Update each `<SelectTrigger>` and `<Input>` className**

Find every `className="h-8 text-sm"` on `<SelectTrigger>` (4 instances) and `<Input>` (2 instances). Replace with:
```tsx
className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary"
```

- [ ] **Step 3: Update the outer container styling**

Find the outer `<div className="space-y-4">` at the top of the return. Replace with:
```tsx
    <div className="space-y-5">
```

- [ ] **Step 4: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test`
Expected: PASS.

```bash
git add components/PropertyFilter.tsx
git commit -m "feat(ui): PropertyFilter — warm labels, rounded inputs, saddle brown focus"
```

### Task 24: Restyle `app/properti/page.tsx` (catalog header + count + grid)

**Files:**
- Modify: `app/properti/page.tsx` (surgical edits)

- [ ] **Step 1: Add new imports**

After the existing `import { SlidersHorizontal } from "lucide-react"` (line 14), add:
```tsx
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { SearchX } from "lucide-react"
```

- [ ] **Step 2: Update the `PropertyGrid` component (lines 75–97)**

Replace the entire `async function PropertyGrid(...)` block with:

```tsx
async function PropertyGrid({ filters }: { filters: Awaited<PageProps["searchParams"]> }) {
  const items = await getProperties(filters)

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
          <SearchX size={28} strokeWidth={1.5} />
        </div>
        <p className="mt-4 font-sans text-lg font-semibold text-foreground">
          Tidak ada properti ditemukan
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Coba ubah atau hapus beberapa filter.
        </p>
        <Button variant="outline" size="sm" className="mt-5 rounded-xl" asChild>
          <a href="/properti">Reset Filter</a>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Menampilkan <span className="font-semibold italic text-primary">{items.length}</span> properti
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((property, i) => (
          <Reveal key={property.id} delay={(i % 3) * 90}>
            <PropertyCard property={property} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update the page header (lines 99–104)**

In `export default async function PropertiPage`, replace the `<h1>` line (line 104):

```tsx
      <SectionHeading eyebrow="Katalog" title="Katalog Properti" />
```

- [ ] **Step 4: Update the filter sidebar panel (line 129)**

```tsx
            <div className="sticky top-20 rounded-3xl bg-secondary/60 p-6">
```

- [ ] **Step 5: Update the mobile filter button (line 110)**

```tsx
            <Button variant="outline" size="sm" className="rounded-xl">
              <SlidersHorizontal size={14} className="mr-1" /> Filter
            </Button>
```

- [ ] **Step 6: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add app/properti/page.tsx
git commit -m "feat(ui): catalog — SectionHeading, italic count, Reveal stagger, warm empty state"
```

### Task 25: Restyle `app/properti/[id]/page.tsx` (price-first, warm specs, saddle brown agent)

**Files:**
- Modify: `app/properti/[id]/page.tsx` (surgical edits — existing structure is already close to spec)

- [ ] **Step 1: Update the title block (lines 140–166)**

Find the `<div className="space-y-2">` (line 140) and the `<h1>` (line 152). Reorder so the price comes FIRST. Replace lines 140–166 with:

```tsx
          <div className="space-y-3">
            <p className="font-sans text-3xl font-bold text-primary sm:text-4xl">
              {formattedPrice}
              {property.listingType === "sewa" && (
                <span className="ml-1 text-base font-normal text-muted-foreground">/bulan</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={property.listingType === "jual" ? "default" : "secondary"} className="rounded-full">
                {property.listingType === "jual" ? "Dijual" : "Disewa"}
              </Badge>
              <Badge variant="outline" className="rounded-full">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
              {property.status !== "active" && (
                <Badge variant="destructive" className="rounded-full">
                  {property.status === "sold" ? "Terjual" : "Tersewa"}
                </Badge>
              )}
            </div>
            <h1 className="font-sans text-2xl font-semibold text-foreground sm:text-3xl">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {property.address ? `${property.address}, ` : ""}
                {property.city}
              </span>
            </div>
          </div>
```

- [ ] **Step 2: Update the description section (lines 177–187)**

Replace lines 177–187 with:

```tsx
          {property.description && (
            <>
              <Separator />
              <div>
                <h2 className="font-sans text-xl font-semibold text-foreground mb-3">
                  Tentang Properti Ini
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-foreground/85">
                  {property.description}
                </p>
              </div>
            </>
          )}
```

- [ ] **Step 3: Update the location heading (line 193)**

```tsx
                <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Lokasi</h2>
```

- [ ] **Step 4: Update PropertySpecs — full rewrite to match new layout**

The current `components/PropertySpecs.tsx` uses a 2x2 grid with bordered cells. The new design uses a single row with vertical hairline dividers. Replace the file with:

```tsx
import { BedDouble, Bath, Maximize2 } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number | null
  bathrooms: number | null
  buildingArea: number | null
  landArea: number | null
}

function Spec({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string | number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-3 first:pl-0 last:pr-0 sm:px-4">
      <Icon size={18} className="text-primary" />
      <p className="font-sans text-2xl font-bold text-primary sm:text-3xl">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  )
}

export default function PropertySpecs({
  bedrooms,
  bathrooms,
  buildingArea,
  landArea,
}: PropertySpecsProps) {
  const items: Array<{ icon: React.ComponentType<{ size?: number; className?: string }>; value: string | number; label: string } | null> = [
    bedrooms != null && { icon: BedDouble, value: bedrooms, label: "Kamar Tidur" },
    bathrooms != null && { icon: Bath, value: bathrooms, label: "Kamar Mandi" },
    buildingArea != null && { icon: Maximize2, value: `${buildingArea} m²`, label: "Luas Bangunan" },
    landArea != null && { icon: Maximize2, value: `${landArea} m²`, label: "Luas Tanah" },
  ].filter(Boolean) as Array<{ icon: React.ComponentType<{ size?: number; className?: string }>; value: string | number; label: string }>

  if (items.length === 0) return null

  return (
    <div className="divide-x divide-border rounded-2xl border border-border bg-secondary/40 px-4 grid grid-cols-2 sm:grid-cols-4 sm:divide-x">
      {items.map((item, i) => (
        <Spec key={i} icon={item.icon} value={item.value} label={item.label} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add app/properti/[id]/page.tsx components/PropertySpecs.tsx
git commit -m "feat(ui): detail — price first, warm prose, saddle brown specs strip"
```

### Task 26: Restyle `PropertyGalleryClient` (warm lightbox, rounded gallery)

**Files:**
- Modify: `components/PropertyGalleryClient.tsx` (surgical className edits)

- [ ] **Step 1: Update gallery grid (line 64)**

```tsx
      <div className="grid grid-cols-3 gap-3 h-80 sm:h-[420px] mb-6 rounded-2xl overflow-hidden border border-border">
```

- [ ] **Step 2: Update thumbnail strip buttons (line 123)**

```tsx
              className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-primary transition-colors"
```

- [ ] **Step 3: Update lightbox backdrop (line 145)**

```tsx
          className="fixed inset-0 z-50 bg-accent/95 flex items-center justify-center outline-none"
```

- [ ] **Step 4: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/PropertyGalleryClient.tsx
git commit -m "feat(ui): PropertyGallery — warm lightbox, rounded cards"
```

### Task 27: Restyle `AgentCard` (warm taupe panel, saddle brown WhatsApp, ring)

**Files:**
- Modify: `components/AgentCard.tsx` (surgical edits)

- [ ] **Step 1: Update the outer container (line 18)**

```tsx
        <div className="sticky top-20 rounded-3xl bg-secondary/60 p-6 space-y-4 border border-border/40">
```

- [ ] **Step 2: Update the heading (line 19)**

```tsx
          <h3 className="font-sans text-lg font-semibold text-foreground">Hubungi Agen</h3>
```

- [ ] **Step 3: Update the agent name (line 23)**

```tsx
              <p className="font-sans text-base font-semibold text-foreground">{agent.fullName}</p>
```

- [ ] **Step 4: Update the WhatsApp button (line 29)**

```tsx
                <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
```

- [ ] **Step 5: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/AgentCard.tsx
git commit -m "feat(ui): AgentCard — warm panel, brown WhatsApp, rounded"
```

### Task 28: Restyle map page (`app/peta/page.tsx`) and map components

**Files:**
- Modify: `app/peta/page.tsx`
- Modify: `components/LeafletMapView.tsx` (branded marker popups)
- Modify: `components/PropertyMap.tsx`, `components/MapView.tsx`, `components/LeafletMap.tsx` (loaders only — minimal edits)

- [ ] **Step 1: Update `app/peta/page.tsx`**

Replace the file with:

```tsx
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, inArray, and, isNull } from "drizzle-orm"
import SectionHeading from "@/components/SectionHeading"
import MapView from "@/components/MapView"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"

export const revalidate = 120

async function getPropertiesWithCoords() {
  const rows = await db
    .select()
    .from(properties)
    .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))

  const withCoords = rows.filter((p) => p.lat && p.lng)

  if (withCoords.length === 0) return []

  return getPropertiesWithImagesBatch(
    db.select().from(properties).where(inArray(properties.id, withCoords.map((p) => p.id))),
  )
}

export default async function PetaPage() {
  const items = await getPropertiesWithCoords()

  return (
    <div className="container mx-auto px-4 py-10">
      <SectionHeading eyebrow="Peta" title="Peta Properti" subtitle="Jelajahi listing berdasarkan lokasi geografis" />
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="h-[calc(100vh-280px)] min-h-[480px]">
          <MapView properties={items} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `components/LeafletMapView.tsx` popup**

In the `<Popup>` block (lines 51–65), update the inner `<div>` and link classNames. Replace the entire `<Popup>` opening tag block with:

```tsx
            <Popup>
              <div className="space-y-1 min-w-36 font-sans">
                <p className="font-semibold text-sm leading-tight text-foreground">{prop.title}</p>
                <p className="text-primary font-bold text-sm">
                  {formatPriceCompact(prop.price, prop.listingType)}
                </p>
                <p className="text-xs text-muted-foreground">{prop.city}</p>
                <a
                  href={`/properti/${prop.id}`}
                  className="mt-2 inline-block rounded-xl bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Lihat Detail →
                </a>
              </div>
            </Popup>
```

- [ ] **Step 3: Update loader styles in `PropertyMap.tsx`, `MapView.tsx`, `LeafletMap.tsx`**

In each `loading:` block, change `rounded-lg` → `rounded-2xl`. The `bg-muted` stays.

- [ ] **Step 4: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add app/peta/page.tsx components/LeafletMapView.tsx components/PropertyMap.tsx components/MapView.tsx components/LeafletMap.tsx
git commit -m "feat(ui): /peta — SectionHeading, warm rounded container, branded marker popups"
```

### Task 29: Stage 4 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS.

- [ ] **Step 2: Manual visual**

Run `pnpm dev`:
- `/properti` — header, filter sidebar warm taupe, grid with PropertyCards.
- `/properti/[id]` — price first, warm specs, AgentCard brown WhatsApp, map rounded.
- `/peta` — page heading, warm map, branded popups.

---

## Stage 5 — Auth + Profile + Final Polish

### Task 30: Restyle `app/masuk/page.tsx` and `app/daftar/page.tsx` (split-screen)

**Files:**
- Modify: `app/masuk/page.tsx`
- Modify: `app/daftar/page.tsx`

- [ ] **Step 1: Update `app/masuk/page.tsx` — replace the JSX return**

Keep the entire `MasukPage` function and its imports. Replace ONLY the `return (...)` JSX. The replacement wraps the existing form fields in a split-screen shell:

```tsx
  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      <div className="relative hidden bg-primary overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=1600&fit=crop&auto=format&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 to-primary/40" />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-primary-foreground">
          <BrandMark size="lg" inverted />
          <p className="mt-6 max-w-sm text-lg font-light italic leading-relaxed">
            Temukan properti impian Anda, di mana pun di Indonesia.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-sans text-2xl font-semibold text-foreground">Masuk</h1>
            <p className="mt-1 text-sm text-muted-foreground">{BRAND.loginDescription}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="kamu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-border focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-border focus-visible:ring-primary"
              />
            </div>
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <Button type="submit" className="btn-press w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
```

Add the new imports at the top of `app/masuk/page.tsx`:
```tsx
import Image from "next/image"
import BrandMark from "@/components/BrandMark"
```

(Keep the other existing imports.)

- [ ] **Step 2: Update `app/daftar/page.tsx` with the same shell**

Same approach: add the new imports (`Image`, `BrandMark`), replace the `return (...)` with the same split-screen structure used in Step 1, with the form content being the 3 fields (Name, Email, Password) from the existing page. The cross-link at the bottom becomes "Sudah punya akun? Masuk".

For brevity, use the same shell as Step 1 with these differences:
- Form fields: Name + Email + Password
- Submit label: "Daftar" / "Mendaftarkan..."
- Cross-link: "Sudah punya akun? Masuk" → `/masuk`

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add app/masuk/page.tsx app/daftar/page.tsx
git commit -m "feat(ui): auth split-screen — photo + BrandMark left, form right"
```

### Task 31: Restyle `app/profil/page.tsx` (header + role pill + favorites)

**Files:**
- Modify: `app/profil/page.tsx` (surgical edits)

- [ ] **Step 1: Add new imports**

Add these imports after the existing `import { useFavorites }` line (line 13):
```tsx
import Reveal from "@/components/Reveal"
import { Heart } from "lucide-react"
```

- [ ] **Step 2: Update the avatar size (line 65)**

```tsx
              <Avatar className="h-20 w-20 border-2 border-primary" size="lg">
```

(Note: `<Avatar>` from shadcn takes className; verify the `size` prop is supported in your shadcn version. If not, drop it — the className controls size.)

- [ ] **Step 3: Update the header Card layout (lines 60–110)**

Replace lines 60–110 with:

```tsx
      <div className="flex items-center gap-5 pb-8 border-b border-border">
        <div className="relative group shrink-0">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {userImage ? (
              <AvatarImage src={userImage} alt={session.user.name ?? ""} className="object-cover" />
            ) : null}
            <AvatarFallback className="text-2xl">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity ${
            uploading ? "opacity-100 bg-primary/60" : "opacity-0 group-hover:opacity-100 bg-primary/40"
          }`}>
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-primary-foreground" />
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
                  button: <Camera size={18} className="text-primary-foreground" />,
                }}
              />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-sans text-2xl font-semibold text-foreground truncate">{session.user.name}</h1>
          <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            {session.user.role === "admin" ? "Admin" : session.user.role === "agent" ? "Agen" : "Pembeli"}
          </span>
        </div>
      </div>
```

- [ ] **Step 4: Update the favorites empty state (lines 119–125)**

```tsx
          <div className="py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Heart size={28} strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-sans text-lg font-semibold text-foreground">Belum ada favorit</p>
            <Button className="mt-5 rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/properti">Jelajahi Properti</Link>
            </Button>
          </div>
```

- [ ] **Step 5: Update the favorites grid (lines 127–132) to 3-col with Reveal**

```tsx
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((prop, i) => (
              <Reveal key={prop.id} delay={(i % 3) * 90}>
                <PropertyCard property={prop} />
              </Reveal>
            ))}
          </div>
```

- [ ] **Step 6: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add app/profil/page.tsx
git commit -m "feat(ui): profile — header w/ avatar, role pill, favorites grid + empty state"
```

### Task 32: Final polish — brand strings, metadata, README

**Files:**
- Verify: `app/layout.tsx` (metadata)
- Modify: `README.md` (rename brand if hardcoded)
- Modify (optional): `package.json` `name` field

- [ ] **Step 1: Verify `app/layout.tsx` metadata uses `BRAND` constants**

Open the file. Confirm lines 19–22 reference `BRAND.pageTitle.home` and `BRAND.pageDescription.home` (the Task 4 brand update should have already caused these to resolve to TAP CATALOG strings via the new `BRAND` object). No code change expected; verify only.

- [ ] **Step 2: Check for stale "Tiga Anak Propertindo" references**

Run:
```bash
grep -r "Tiga Anak Propertindo" app components lib hooks README.md 2>/dev/null
```

For each file in the result (typically just `README.md`):
- `README.md` — replace "Tiga Anak Propertindo" with "TAP CATALOG".

If the grep returns no matches, skip to the next step.

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add -A
git commit -m "docs: brand rename TAP CATALOG — README + any remaining references"
```

### Task 33: Final verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS — 0 errors, 0 warnings (or only known-acceptable ones).

- [ ] **Step 2: Full visual smoke test**

Run `pnpm dev` and visit every public route:
- `/` — Hero, About, HowWeWork, Properti, Cities, Contact, Footer
- `/properti` — header, filter, grid, empty state
- `/properti/[any-id]` — gallery, title block, specs, description, agent, map
- `/peta` — heading, warm map
- `/masuk` — split-screen
- `/daftar` — split-screen
- `/profil` (signed in) — header, favorites
- Any 404 / error page

All pages should:
- Render in light mode only
- Use Poppins (Manrope in Navbar)
- Use saddle brown as primary color
- Have no console errors
- No `dark:` classes anywhere
- `next-themes` no longer imported

- [ ] **Step 3: Push branch (optional — only if user asks)**

Do NOT push unless explicitly requested. Final commit summary:

```bash
git log --oneline | head -40
```

Review the commits, verify no secrets committed, no `.env` files.
