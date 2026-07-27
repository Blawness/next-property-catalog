# TAP CATALOG Homepage — Mockup-Aligned Rebuild Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage (Hero, About, HowWeWork, Contact, Navbar) and swap the font + accent color to match the authoritative HTML mockup at `references/SVG ke HTML mockup Next.js.zip` exactly. Keep foundation (tokens, primitives, shared components, catalog/detail/map/auth/profile) as-is.

**Architecture:** Mockup-driven rebuild. Replace Poppins with **Mulish** (single font family for everything). Change `--primary` from oklch saddle to **hex `#723511`** (matches mockup's `--accent: #723511`). Rebuild 4 homepage sections to use the mockup's exact dimensions, copy, and visual tricks (white-to-transparent hero gradient, `paint-order: stroke fill` on "Contact" word, outline-only cards). Use mockup's raster logo + extract assets to `public/mockup-assets/`. Update Navbar to plain text (no icons). Keep Properti, Kota Populer, Footer, auth, profile, catalog, detail, map as-is.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (CSS-first config), `next/font/google` (Mulish), lucide-react, sonner, Drizzle ORM, Neon Postgres, NextAuth v4, Jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-27-tap-catalog-homepage-design.md` (Section 3 revised per HTML mockup)
**Reference (authoritative):** `references/SVG ke HTML mockup Next.js.zip` (extract with `unzip`)
**Supersedes (for these components only):** Stage 1 (font + color tokens), Stage 2 (Navbar, BrandMark usage), Stage 3 (Hero, About, HowWeWork, Contact, page.tsx) of the prior `2026-07-27-tap-catalog-homepage.md` plan.

**Verification order (every gate):** `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`

---

## Stage 0 — Assets & Foundation

### Task 0: Extract mockup assets to `public/mockup-assets/`

**Files:**
- Add: `public/mockup-assets/logo web tap catalog.png` (already in repo from prior extract — verify presence)
- Add: `public/mockup-assets/tap catalog logo.svg`
- Add: `public/mockup-assets/web tap catalog.svg` (the original mockup SVG — keep as reference)
- Add: `public/mockup-assets/about us component.png` (the cropped skyscraper image for the About section)

- [ ] **Step 1: Verify the assets are present**

```bash
ls -la public/mockup-assets/
```

Expected:
- `logo web tap catalog.png` (~5.7KB)
- `tap catalog logo.svg` (~8.3KB)
- `web tap catalog.svg` (~863KB)
- `about us component.png` (~546KB)

If any are missing, re-extract from `references/SVG ke HTML mockup Next.js.zip`:
```bash
unzip -j -o "references/SVG ke HTML mockup Next.js.zip" "uploads/*" -d public/mockup-assets/
```

(Note: file names contain spaces — `next/image` will work with them, but be careful with imports.)

- [ ] **Step 2: Verify Next.js image config allows the local path**

The `next.config.ts` already configures `images.unsplash.com`, `utfs.io`, etc. Local paths under `/public/mockup-assets/` work without any config change. No action needed.

- [ ] **Step 3: Commit**

```bash
git add public/mockup-assets/
git commit -m "chore(assets): extract mockup logo + about image to public/mockup-assets"
```

---

## Stage 1 — Font & Color Foundation

### Task 1: Swap fonts Poppins+Manrope → Mulish in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the imports and font definitions**

```tsx
import type { Metadata } from "next"
import { Mulish } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import ConditionalFooter from "@/components/ConditionalFooter"
import Providers from "@/components/Providers"
import { BRAND } from "@/lib/brand"

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-mulish",
})
```

- [ ] **Step 2: Update the `<html>` tag**

```tsx
    <html lang="id" className={mulish.variable}>
```

(Remove the `manrope.variable` reference; Mulish is the only font now.)

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: build PASSES (Google Fonts fetched at build time).

```bash
git add app/layout.tsx
git commit -m "feat(ui): swap Poppins+Manrope for Mulish (single font, mockup-aligned)"
```

### Task 2: Update font token references in `app/globals.css`

**Files:**
- Modify: `app/globals.css` (the `--font-sans`, `--font-heading`, `--font-display` lines in `@theme inline`, and the `.font-display` utility)

- [ ] **Step 1: Update `@theme inline` font tokens**

Replace the three font lines:
```css
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
```
With:
```css
  --font-sans: var(--font-mulish), ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-mulish), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-mulish), ui-sans-serif, system-ui, sans-serif;
```

- [ ] **Step 2: Update the `.font-display` utility**

Replace the existing `.font-display` block in `@layer utilities`:
```css
@layer utilities {
  .font-display {
    font-family: var(--font-display);
  }
  .text-outline {
    color: transparent;
    -webkit-text-stroke: 2px var(--primary);
  }
}
```

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add app/globals.css
git commit -m "feat(ui): update font tokens — all reference --font-mulish"
```

### Task 3: Change `--primary` from oklch to hex `#723511`

**Files:**
- Modify: `app/globals.css` (the `--primary` line in `:root`)
- Modify: `app/globals.css` (the `--ring` and `--chart-1` if they reference the same hue)
- Modify: `components/ui/button.tsx` (if it uses hardcoded color values that should match)

- [ ] **Step 1: Update `--primary` in `:root`**

Find the line `--primary: oklch(0.45 0.12 40);` and replace with:
```css
  --primary: #723511;
```

- [ ] **Step 2: Update `--primary-foreground` if it has a different tone**

The current `--primary-foreground: oklch(0.99 0.005 80);` is white — keep as-is.

- [ ] **Step 3: Update other accent references**

Search for any other uses of the old saddle brown oklch value:
```bash
grep -r "oklch(0.45 0.12 40)" app components lib
```
For each match, decide: if it's a related token (like a chart color), update to the new hex or a derived color. If it's unrelated, leave alone.

- [ ] **Step 4: Update `--chart-1` if it was the primary brown**

The mockup only uses one brown (#723511) and one black (#111). For now, keep `--chart-1` as the same hex since it's the primary brand color used in chart contexts. Replace any `oklch(0.45 0.12 40)` reference in the chart scale with `#723511`.

- [ ] **Step 5: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm test && pnpm build`

```bash
git add app/globals.css
git commit -m "feat(ui): change --primary to #723511 hex (matches mockup)"
```

### Task 4: Stage 1 verification gate

- [ ] **Step 1: Run full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS (existing 41 tests should still pass — visual changes only).

- [ ] **Step 2: Commit any new worktree config (no functional changes expected)**

```bash
git status
```

If any build artifacts, ignore. Otherwise no commit.

---

## Stage 2 — Rebuild Hero, About, HowWeWork, Contact (homepage sections)

### Task 5: Rebuild `HeroSection` — white-to-transparent overlay, bottom CTAs, skyscraper

**Files:**
- Modify: `components/HeroSection.tsx` (full rewrite)

- [ ] **Step 1: Replace the file with**

```tsx
"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden h-[78vh] min-h-[560px] max-h-[820px]"
    >
      <Image
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
        alt="Commercial skyscraper"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 42%" }}
      />

      {/* White-to-transparent overlay — headline sits on white, photo shows below */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, rgba(255,255,255,.92) 26%, rgba(255,255,255,.35) 48%, rgba(255,255,255,0) 66%)",
        }}
      />

      <div className="relative h-full flex flex-col items-center pt-[105px]">
        <h1 className="m-0 text-center font-sans text-foreground leading-[1.05] tracking-[-0.015em] text-balance text-[clamp(2rem,5.2vw,3.94rem)]">
          <span className="block font-light italic">Discover Your Mission</span>
          <span className="block font-bold">Build Our Passion</span>
        </h1>

        {/* CTAs pinned to bottom of hero, overlaid on photo */}
        <div className="mt-auto mb-[76px] flex flex-wrap items-center justify-center gap-[clamp(2rem,5vw,5.5rem)]">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 h-11 px-[26px] rounded-full font-sans text-[19px] font-bold tracking-[0.05em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book now
            <ChevronRight size={17} strokeWidth={2.1} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full font-sans text-[19px] font-bold tracking-[0.05em] uppercase bg-[#111] text-white hover:bg-black/80 transition-colors"
          >
            For seller
          </a>
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
git commit -m "feat(ui): hero — white-to-transparent overlay, bottom CTAs, skyscraper photo (mockup-aligned)"
```

### Task 6: Rebuild `AboutSection` — asymmetric image, light stats, mockup copy

**Files:**
- Modify: `components/AboutSection.tsx` (full rewrite)
- Modify: `components/AboutSection.test.tsx` (update assertions for mockup's literal numbers)

- [ ] **Step 1: Update the test FIRST**

In `components/AboutSection.test.tsx`, replace the existing test with:

```tsx
import { render, screen } from '@testing-library/react'
import AboutSection from '@/components/AboutSection'

describe('AboutSection', () => {
  it('renders heading, body, and 3 mockup-literal stats', () => {
    render(<AboutSection />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText(/TAP Catalog is a federal network/)).toBeInTheDocument()
    expect(screen.getByText('20+')).toBeInTheDocument()
    expect(screen.getByText('served clients')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('our database')).toBeInTheDocument()
    expect(screen.getByText('99%')).toBeInTheDocument()
    expect(screen.getByText('quality property')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- AboutSection`
Expected: FAIL (the new text "About Us" / "20+" / "served clients" / etc. don't exist yet in the current AboutSection).

- [ ] **Step 3: Replace the file with**

```tsx
import Image from "next/image"

const STATS = [
  { n: "20+", label: "served clients" },
  { n: "30", label: "our database" },
  { n: "99%", label: "quality property" },
] as const

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-[768px] px-[clamp(1.5rem,5vw,4.5rem)] pt-[clamp(6rem,13vw,11rem)] pb-0 grid grid-cols-1 md:[grid-template-columns:690px_1fr] md:gap-x-[60px] md:items-start"
    >
      <div>
        <h2 className="m-0 font-sans text-[clamp(2.5rem,5vw,3.9rem)] leading-none font-bold tracking-[-0.02em] text-foreground">
          About Us
        </h2>
        <p className="mt-[82px] max-w-[690px] font-sans text-[20px] leading-[34px] text-pretty text-foreground">
          TAP Catalog is a federal network of commercial real estate agencies.
          We help companies from startups to coorporations – to find rent, buy, and
          property showcase. Our team takes care of the search, negotiations, legal
          verification, and transaction support until the contract is signed.
        </p>
      </div>

      <div className="hidden md:block" aria-hidden />

      {/* Asymmetric image — bleeds off the right edge of the section */}
      <div
        role="img"
        aria-label="Commercial tower"
        className="relative w-[260px] sm:w-[320px] md:w-[400px] h-[320px] sm:h-[400px] md:h-[500px] mt-12 md:mt-0 md:absolute md:right-[-80px] md:top-[180px] overflow-hidden rounded-2xl"
      >
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&h=1100&q=80"
          alt="Commercial tower"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
      </div>

      {/* Stats row — full width below, 3 columns centered */}
      <div className="col-span-full mt-[clamp(2rem,4vw,4rem)] flex flex-col sm:flex-row items-center justify-center gap-[clamp(2.5rem,7vw,7.5rem)] py-8">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-[22px]">
            <span className="font-sans text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.8] font-light tracking-[-0.03em] text-foreground">
              {s.n}
            </span>
            <span className="font-sans text-[20px] whitespace-nowrap text-foreground">
              {s.label}
            </span>
          </div>
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
git commit -m "feat(ui): about — asymmetric image bleed, light 120px stats, mockup-literal copy"
```

### Task 7: Rebuild `HowWeWork` — outline-only cards, 66px black icons, mockup copy

**Files:**
- Modify: `components/HowWeWork.tsx` (full rewrite)
- Modify: `components/HowWeWork.test.tsx` (update assertions for mockup's English copy)

- [ ] **Step 1: Update the test FIRST**

In `components/HowWeWork.test.tsx`, replace the existing test with:

```tsx
import { render, screen } from '@testing-library/react'
import HowWeWork from '@/components/HowWeWork'

describe('HowWeWork', () => {
  it('renders heading and 4 mockup-literal step titles', () => {
    render(<HowWeWork />)
    expect(screen.getByText('How We Work')).toBeInTheDocument()
    expect(screen.getByText('Free Consultation')).toBeInTheDocument()
    expect(screen.getByText('Search & Selection')).toBeInTheDocument()
    expect(screen.getByText('Data Verification')).toBeInTheDocument()
    expect(screen.getByText('Finishing')).toBeInTheDocument()
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

- [ ] **Step 3: Replace the file with**

```tsx
import {
  MessageCircle,
  Search,
  FileText,
  Handshake,
  type LucideIcon,
} from "lucide-react"

const STEPS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description:
      "consultation needs analysist. we determine what type of property you need",
  },
  {
    icon: Search,
    title: "Search & Selection",
    description:
      "we offer only verified properties that match your budget and goals",
  },
  {
    icon: FileText,
    title: "Data Verification",
    description: "we conduct a review all documents and ownership",
  },
  {
    icon: Handshake,
    title: "Finishing",
    description:
      "we provide support include contract and accompany you at all stages",
  },
]

export default function HowWeWork() {
  return (
    <section
      id="how"
      className="min-h-[768px] px-[clamp(1.5rem,5vw,4.5rem)] pt-[clamp(6rem,13vw,12rem)] pb-0"
    >
      <h2 className="m-0 text-center font-sans text-[clamp(2.5rem,5vw,3.9rem)] leading-none font-bold tracking-[-0.02em] text-foreground">
        How We Work
      </h2>

      <div className="mt-[clamp(2rem,4vw,3.3rem)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="h-[clamp(280px,24vw,385px)] box-border border border-primary bg-transparent rounded-3xl pt-[clamp(2.5rem,5vw,4.5rem)] px-7 flex flex-col items-center text-center"
            >
              <div className="w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-full bg-[#111] text-white flex items-center justify-center">
                <Icon size={28} strokeWidth={2.1} />
              </div>
              <h3 className="mt-[clamp(1.5rem,2.5vw,2.5rem)] font-sans text-[clamp(1.25rem,1.7vw,1.625rem)] font-bold tracking-[-0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-[15px] font-sans text-[clamp(0.95rem,1.2vw,1.19rem)] leading-[27px] text-pretty text-foreground">
                {step.description}
              </p>
            </div>
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
git commit -m "feat(ui): how-we-work — outline cards, 66px black icon circles, mockup English copy"
```

### Task 8: Rebuild `ContactSection` — paint-order trick, 3-field form, brown panel overlap

**Files:**
- Modify: `components/ContactSection.tsx` (full rewrite)
- Modify: `components/ContactSection.test.tsx` (update for new structure: italic subtitle, contact list with mail/phone/map-pin, 3-field form, no info column heading)

- [ ] **Step 1: Update the test FIRST**

In `components/ContactSection.test.tsx`, replace the existing test with:

```tsx
import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import ContactSection from '@/components/ContactSection'

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}))

describe('ContactSection', () => {
  it('renders Contact word, italic subtitle, 3-form fields, contact list, footer', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText(/Tell us what you are looking for/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Work email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What are you looking for?')).toBeInTheDocument()
    expect(screen.getByText('hello@tapcatalog.com')).toBeInTheDocument()
    expect(screen.getByText(/\+62 21 5000 1200/)).toBeInTheDocument()
    expect(screen.getByText(/Sudirman 52, Jakarta/)).toBeInTheDocument()
    expect(screen.getByText(/© 2026 TAP Catalog/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- ContactSection`
Expected: FAIL (the new text/placeholders don't exist yet).

- [ ] **Step 3: Replace the file with**

```tsx
"use client"

import { useState, type FormEvent } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { toast } from "sonner"

const CONTACT = {
  email: "hello@tapcatalog.com",
  phone: "+62 21 5000 1200",
  address: "Jl. Jend. Sudirman 52, Jakarta",
}

export default function ContactSection() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    toast.success("Pesan terkirim! Kami akan menghubungi Anda segera.")
  }

  return (
    <section id="contact" className="relative min-h-[768px]">
      {/* "Contact" word — paint-order trick: stroke behind fill */}
      <h2
        className="absolute left-[clamp(1.5rem,5vw,4.5rem)] top-[clamp(6rem,11vw,10rem)] z-[2] m-0 font-sans text-[clamp(4rem,9vw,9rem)] leading-none font-extrabold tracking-[-0.03em]"
        style={{
          color: "#fff",
          WebkitTextStroke: "4px var(--primary)",
          paintOrder: "stroke fill",
        }}
      >
        Contact
      </h2>

      {/* Brown panel — starts below the Contact word so the word overlaps it */}
      <div
        className="absolute left-0 right-0 top-[clamp(11rem,16vw,15.75rem)] bottom-0 bg-primary text-white"
        style={{
          padding: "clamp(4rem, 8vw, 8.25rem) clamp(1.5rem, 5vw, 4.5rem) 56px",
          display: "grid",
          gridTemplateColumns: "1fr 560px",
          columnGap: "80px",
          alignItems: "start",
        }}
      >
        <div>
          <p
            className="m-0 max-w-[440px] font-sans text-[clamp(1.25rem,1.7vw,1.625rem)] leading-[38px] font-light italic text-pretty text-white"
          >
            Tell us what you are looking for — we reply with a shortlist within one
            working day.
          </p>

          <div className="mt-[44px] flex flex-col gap-[18px] font-sans text-[20px] text-white">
            <span className="flex items-center gap-[14px]">
              <span className="block w-5 h-5 opacity-80">
                <Mail size={20} strokeWidth={2.1} />
              </span>
              {CONTACT.email}
            </span>
            <span className="flex items-center gap-[14px]">
              <span className="block w-5 h-5 opacity-80">
                <Phone size={20} strokeWidth={2.1} />
              </span>
              {CONTACT.phone}
            </span>
            <span className="flex items-center gap-[14px]">
              <span className="block w-5 h-5 opacity-80">
                <MapPin size={20} strokeWidth={2.1} />
              </span>
              {CONTACT.address}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <input
            type="email"
            placeholder="Work email"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <input
            type="text"
            placeholder="What are you looking for?"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <button
            type="submit"
            className="h-14 border-0 rounded-xl bg-white text-primary font-sans text-[19px] font-bold tracking-[0.05em] uppercase cursor-pointer hover:bg-[#111] hover:text-white transition-colors"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {sent ? "Thank you" : "Send request"}
              <Send size={16} strokeWidth={2.1} />
            </span>
          </button>
        </form>

        <div className="col-span-full mt-auto pt-10 flex justify-between font-sans text-[16px] text-white/70">
          <span>© 2026 TAP Catalog</span>
          <span>Commercial real estate network</span>
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
git commit -m "feat(ui): contact — paint-order trick, 3-field form, brown panel overlap, mockup contact list"
```

### Task 9: Update `app/page.tsx` to use new AboutSection (no `SectionHeading` wrapper)

The new `AboutSection` already includes its own "About Us" title — the old homepage had `SectionHeading` plus `AboutSection` which double-titled. Simplify the homepage to just render the new sections in order.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read the current `app/page.tsx`**

- [ ] **Step 2: Replace the `app/page.tsx` with**

```tsx
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import HowWeWork from "@/components/HowWeWork"
import PopularCities from "@/components/PopularCities"
import ContactSection from "@/components/ContactSection"
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

      {/* Property cards (kept from previous implementation) */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <PopularCities />
      <ContactSection />
    </div>
  )
}
```

(Removed `ExploreTypes` and `SectionHeading` references from homepage — ExploreTypes still exists as a component for `/properti` page; `SectionHeading` is still used elsewhere.)

- [ ] **Step 3: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`

```bash
git add app/page.tsx
git commit -m "feat(ui): homepage — remove SectionHeading wrapper, simpler structure"
```

### Task 10: Stage 2 verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS. Tests should still be 41 (the test count grew by 0 in this rebuild — we updated existing tests but didn't add new ones).

- [ ] **Step 2: Manual visual check**

Run `pnpm dev`, open `http://localhost:3000`. Verify:
- Navbar: plain text, 21px, no icons, 58px gap
- Hero: white-to-transparent overlay (headline on white, photo below), bottom-center CTAs
- About: "About Us" + paragraph + skyscraper bleeding off right + 3 large light stats (20+, 30, 99%)
- How We Work: 4 outline cards with black circle icons, English copy
- (Property cards + PopularCities still render between HowWeWork and Contact)
- Contact: huge "Contact" word with white fill + brown stroke, overlapping the brown panel; 3-field form on the right; contact list on the left

---

## Stage 3 — Navbar restyle (plain text, no icons, mockup spacing)

### Task 11: Restyle `Navbar` — plain text nav, mockup spacing

**Files:**
- Modify: `components/Navbar.tsx` (rewrite the nav links block)

- [ ] **Step 1: Read the current Navbar**

- [ ] **Step 2: Replace the nav links block**

Find the existing `NAV_LINKS` constant and the nav links render block. Replace them with:

```tsx
const NAV_LINKS = [
  { href: "/#home",    label: "Home",       id: "home" },
  { href: "/#about",   label: "About us",   id: "about" },
  { href: "/#how",     label: "How we work", id: "how" },
  { href: "/properti", label: "Listings",   id: "listings" },
  { href: "/#contact", label: "Contacts",   id: "contact" },
]
```

- [ ] **Step 3: Update the nav links render**

Find the `<div className="hidden sm:flex items-center gap-7">` and the `.map` inside. Replace with:

```tsx
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center"
          style={{ gap: "58px", fontSize: "21px", fontWeight: 500 }}
        >
          {NAV_LINKS.map(({ href, label, id }) => {
            const active = id === "home" ? pathname === "/" : pathname === href || pathname.startsWith(href.replace(/#.*$/, ""))
            return (
              <a
                key={id}
                href={href}
                data-nav={id}
                className={cn(
                  "transition-colors",
                  active
                    ? "text-primary font-bold"
                    : "text-primary/45 hover:text-primary",
                )}
              >
                {label}
              </a>
            )
          })}
        </nav>
```

(Removed icons. Mockup nav is plain text, weight 500 default / 700 active. Active state is detected by URL hash/id matching.)

- [ ] **Step 4: Update the BrandMark size in the Navbar header**

Find `<BrandMark size="md" />` in the Navbar. Replace with the raster logo image:

```tsx
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mockup-assets/logo web tap catalog.png"
            alt={BRAND.name}
            style={{ display: "block", width: 154, height: 48 }}
          />
        </Link>
```

- [ ] **Step 5: Verify & commit**

Run: `pnpm exec tsc --noEmit && pnpm lint`

```bash
git add components/Navbar.tsx
git commit -m "feat(ui): navbar — plain text nav (no icons), raster logo, mockup spacing"
```

### Task 12: Final verification gate

- [ ] **Step 1: Full check**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: PASS. 41 tests pass (3 modified — AboutSection, HowWeWork, ContactSection assertions updated).

- [ ] **Step 2: Manual visual**

Open `http://localhost:3000` and verify the homepage now matches the mockup:
- Navbar: raster logo (small brown "TAP CATALOG" with building icon), plain text nav, no icons
- Hero: skyscraper photo with WHITE gradient overlay (headline visible on white top half), 2 CTAs at bottom
- About: text + skyscraper bleeding right + 3 huge light stats (20+, 30, 99%)
- How We Work: 4 outline cards, black circle icons, English copy
- Contact: huge "Contact" word with paint-order effect, brown panel below with 3-field form + contact list

- [ ] **Step 3: Side-by-side comparison**

Open the mockup HTML directly in browser: `file:///tmp/opencode/htm/TAP%20Catalog.dc.html`

Compare side-by-side. The structure, typography, and color should be visually equivalent. The mockup is at 1366px fixed; your local is responsive — at that width they should look very similar.

- [ ] **Step 4: Commit any final tweaks**

If during visual comparison you find small mismatches, fix and commit them with descriptive messages.

---

## Out of scope (not changed in this plan)

- **Footer** — kept as-is from prior plan (saddle brown panel, 4 columns). The mockup doesn't have a separate footer; its footer is INSIDE the contact section. Could be consolidated later.
- **PropertyCard, ExploreTypes, PopularCities, ProfilePage, AuthPages, CatalogPage, DetailPage, MapPage** — all kept as-is.
- **Admin pages** — out of scope (uses broken `bg-brown-*` classes — separate task).
- **Dark mode** — already removed in prior plan, locked to light.
- **Responsive breakpoint tuning** — the current responsive breakpoints are reasonable mirrors of the mockup. Per-pixel fine-tuning at every viewport is out of scope.

## Risks

- **paint-order browser support**: `paint-order: stroke fill` is widely supported in modern browsers (Chrome, Firefox, Safari). Older browsers may show the stroke on top. Acceptable.
- **Fixed-width mockup at 1366px**: at exactly 1366px the layouts mirror precisely; at larger/smaller viewports, responsive scaling kicks in (font sizes use `clamp()`, paddings use `clamp()`).
- **Mockup uses 654px hero height**; current spec uses `h-[78vh] min-h-[560px] max-h-[820px]`. At 1366×768 viewport, 78vh = 599px (close to 654 but not exact). Acceptable visual variance.
- **Image asset filenames contain spaces** — `next/image` works with spaces in src but be careful with imports.
