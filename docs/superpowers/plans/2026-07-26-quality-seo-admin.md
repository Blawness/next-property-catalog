# Quality, SEO, and Admin Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tests + typecheck, ship persistent rate limiting, property-page SEO, and admin bulk/soft-delete with audit log.

**Architecture:** Five independent phases that can ship in any order. Each task follows TDD (red → green → commit) and touches 1-4 files. Backend uses Drizzle + Neon; tests use Jest with mocked `db`/`next-auth`. Soft-delete uses a `deleted_at` column. Rate limiter becomes a driver pattern (in-memory dev / DB prod).

**Tech Stack:** Next.js 16 (App Router), Drizzle ORM, Neon serverless Postgres, NextAuth v4, Zod, Jest 30 + @testing-library/react, sonner, shadcn/ui (radix-nova).

**Execution order:** Phase 0 (foundations) → Phase 1 (tests) → Phase 2 (rate limit) → Phase 3 (SEO) → Phase 4 (admin) → Phase 5 (CI). Phases 2/3/4 are independent and can run in parallel by separate agents.

---

## Phase 0 — Foundations

### Task 0.1: Add `typecheck` script and fix any surface errors

**Files:** `package.json`

- [ ] Open `package.json` and add the `typecheck` script in the `scripts` block:

```json
"typecheck": "tsc --noEmit"
```

- [ ] Run: `pnpm typecheck`
- [ ] **Fix every error that surfaces** (do not silence with `@ts-ignore` unless documented inline). Common locations: `lib/types.ts` `UserRole` is missing `"admin"`, `app/api/properties/route.ts:44` casts status as 3-value union while schema allows `archived`.
- [ ] Run: `pnpm typecheck` → expect exit code 0, no output.
- [ ] Commit:

```bash
git add package.json <any other file you fixed>
git commit -m "chore: add typecheck script and fix type errors"
```

### Task 0.2: Add coverage config to Jest

**Files:** `jest.config.js`

- [ ] Open `jest.config.js`. Add a `coverageThreshold` to the exported `config` object:

```javascript
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'app/api/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: { lines: 50, statements: 50 },
  },
}
```

- [ ] Run: `pnpm test -- --coverage --passWithNoTests`
- [ ] Expect: coverage report prints; threshold NOT met yet (only 1 test exists). Do not gate CI yet — that is Task 5.1.
- [ ] Commit:

```bash
git add jest.config.js
git commit -m "test: configure jest coverage collection"
```

---

## Phase 1 — Test Coverage

### Task 1.1: Unit tests for `lib/rate-limit.ts`

**Files:**
- Create: `lib/__tests__/rate-limit.test.ts`

- [ ] **Write the failing test** at `lib/__tests__/rate-limit.test.ts`:

```typescript
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows up to max requests within the window', () => {
    const key = getRateLimitKey('user-1', 'login')
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key).success).toBe(true)
    }
    const sixth = rateLimit(key)
    expect(sixth.success).toBe(false)
    expect(sixth.remaining).toBe(0)
  })

  it('resets after the window elapses', () => {
    const key = getRateLimitKey('user-2', 'login')
    for (let i = 0; i < 5; i++) rateLimit(key)
    expect(rateLimit(key).success).toBe(false)
    jest.advanceTimersByTime(15 * 60 * 1000 + 1)
    expect(rateLimit(key).success).toBe(true)
  })

  it('isolates keys per (identifier, action)', () => {
    expect(rateLimit(getRateLimitKey('a', 'login')).success).toBe(true)
    expect(rateLimit(getRateLimitKey('a', 'register')).success).toBe(true)
    expect(rateLimit(getRateLimitKey('b', 'login')).success).toBe(true)
  })

  it('returns resetAt in the future', () => {
    const r = rateLimit(getRateLimitKey('x', 'y'))
    expect(r.resetAt).toBeGreaterThan(Date.now())
  })
})
```

- [ ] Run: `pnpm test lib/__tests__/rate-limit.test.ts` → expect 4 passing (the in-memory map persists across tests so we use unique keys).
- [ ] **Module state caveat:** `store` is module-level. Because we use unique keys per test, isolation is fine. If you ever refactor, make sure the store is reset between tests (e.g. expose a `__reset` for testing).
- [ ] Commit:

```bash
git add lib/__tests__/rate-limit.test.ts
git commit -m "test: add unit tests for rate-limit"
```

### Task 1.2: Unit tests for `lib/db-helpers.ts`

**Files:**
- Create: `lib/__tests__/db-helpers.test.ts`

- [ ] **Write the failing test**. Mock drizzle `db` and `inArray`:

```typescript
jest.mock('@/db', () => {
  const images: Record<string, Array<{ id: string; propertyId: string; url: string; isPrimary: boolean; order: number }>> = {}
  return {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockImplementation(async () => Object.values(images).flat()),
    },
    __setImages: (data: typeof images) => { Object.keys(images).forEach((k) => delete images[k]); Object.assign(images, data) },
  }
})

import { getPropertiesWithImagesBatch } from '@/lib/db-helpers'
import type { InferSelectModel } from 'drizzle-orm'
import { properties, propertyImages } from '@/db/schema'

const mockDb = jest.requireMock('@/db') as {
  db: { orderBy: jest.Mock }
  __setImages: (data: any) => void
}

const sampleProperty: InferSelectModel<typeof properties> = {
  id: 'p1',
  title: 'T1',
  description: null,
  price: '1000',
  type: 'rumah',
  listingType: 'jual',
  city: 'Jakarta',
  address: null,
  lat: null,
  lng: null,
  landArea: null,
  buildingArea: null,
  bedrooms: null,
  bathrooms: null,
  agentId: null,
  status: 'active',
  createdAt: null,
}

describe('getPropertiesWithImagesBatch', () => {
  it('returns empty array when no properties', async () => {
    mockDb.__setImages({})
    const result = await getPropertiesWithImagesBatch(Promise.resolve([]))
    expect(result).toEqual([])
  })

  it('attaches images to their properties by id', async () => {
    mockDb.__setImages({
      p1: [
        { id: 'i1', propertyId: 'p1', url: 'a.jpg', isPrimary: true, order: 0 },
        { id: 'i2', propertyId: 'p1', url: 'b.jpg', isPrimary: false, order: 1 },
      ],
    })
    const result = await getPropertiesWithImagesBatch(Promise.resolve([sampleProperty]))
    expect(result[0].images).toHaveLength(2)
    expect(result[0].images[0].url).toBe('a.jpg')
  })

  it('uses empty array when property has no images', async () => {
    mockDb.__setImages({})
    const result = await getPropertiesWithImagesBatch(Promise.resolve([sampleProperty]))
    expect(result[0].images).toEqual([])
  })

  it('ignores images whose propertyId is null', async () => {
    mockDb.__setImages({
      p1: [{ id: 'i1', propertyId: 'p1', url: 'a.jpg', isPrimary: true, order: 0 }],
      null: [{ id: 'i2', propertyId: null, url: 'orphan.jpg', isPrimary: false, order: 0 }],
    } as any)
    const result = await getPropertiesWithImagesBatch(Promise.resolve([sampleProperty]))
    expect(result[0].images).toHaveLength(1)
  })
})
```

- [ ] Run: `pnpm test lib/__tests__/db-helpers.test.ts` → expect 4 passing.
- [ ] Commit:

```bash
git add lib/__tests__/db-helpers.test.ts
git commit -m "test: add unit tests for db-helpers batch query"
```

### Task 1.3: Integration tests for property API routes (auth + happy path)

**Files:**
- Create: `app/api/properties/__tests__/route.test.ts`

- [ ] **Write the failing test**. Mock `@/db`, `next-auth`, and `@/lib/rate-limit`:

```typescript
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(() => ({ success: true, remaining: 29, resetAt: Date.now() + 60_000 })),
  getRateLimitKey: jest.fn((id: string, action: string) => `${action}:${id}`),
}))
jest.mock('@/db', () => {
  const inserted: any[] = []
  return {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 'new-id' }]),
        }),
      }),
    },
  }
})

import { GET, POST } from '@/app/api/properties/route'
import { getServerSession } from 'next-auth'
import { rateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

const mockSession = getServerSession as jest.Mock
const mockRateLimit = rateLimit as jest.Mock

function makeReq(url: string, body?: any): NextRequest {
  return new NextRequest(new Request(url, body ? { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } } : undefined))
}

describe('GET /api/properties', () => {
  it('returns 403 for non-admin', async () => {
    mockSession.mockResolvedValue({ user: { role: 'buyer' } })
    const res = await GET(makeReq('http://localhost/api/properties') as any)
    expect(res.status).toBe(403)
  })

  it('returns 403 for unauthenticated', async () => {
    mockSession.mockResolvedValue(null)
    const res = await GET(makeReq('http://localhost/api/properties') as any)
    expect(res.status).toBe(403)
  })
})

describe('POST /api/properties', () => {
  beforeEach(() => { mockSession.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' } }) })

  it('returns 429 when rate limited', async () => {
    mockRateLimit.mockReturnValueOnce({ success: false, remaining: 0, resetAt: 0 })
    const res = await POST(makeReq('http://localhost/api/properties', { title: 'X', price: '1', type: 'rumah', listingType: 'jual', city: 'Jakarta' }) as any)
    expect(res.status).toBe(429)
  })

  it('returns 400 on validation failure', async () => {
    const res = await POST(makeReq('http://localhost/api/properties', { title: '' }) as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Validasi gagal')
  })

  it('returns 201 on valid payload (skipped: route returns 200 with id)', async () => {
    const res = await POST(makeReq('http://localhost/api/properties', {
      title: 'Rumah Minimalis', price: '1000000', type: 'rumah', listingType: 'jual', city: 'Jakarta',
    }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe('new-id')
  })
})
```

- [ ] Run: `pnpm test app/api/properties/__tests__/route.test.ts` → expect 5 passing.
- [ ] If the route file is `.ts` (it is), no JSX needed. The `as any` on `NextRequest` is required because we constructed it from a web `Request`. Add a comment in the test file:

```typescript
// NextRequest constructor is fine; cast silences strict signature in test harness.
```

- [ ] Commit:

```bash
git add app/api/properties/__tests__/route.test.ts
git commit -m "test: integration tests for /api/properties GET/POST"
```

### Task 1.4: Test for the property detail hook `useFavorites`

**Files:**
- Create: `hooks/__tests__/useFavorites.test.ts`

- [ ] **Read** `hooks/useFavorites.ts` first to know the exact API surface.
- [ ] **Write the failing test** (adjust to match the real hook signature):

```typescript
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '@/hooks/useFavorites'

describe('useFavorites', () => {
  it('toggles a favorite id in/out of the set', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('p1'))
    expect(result.current.has('p1')).toBe(true)
    act(() => result.current.toggle('p1'))
    expect(result.current.has('p1')).toBe(false)
  })
})
```

- [ ] If the hook's signature differs (e.g. takes an `initial` arg or returns `{ ids, toggle }`), adjust the test to match **without changing the hook**. The test should pin the current behavior.
- [ ] Run: `pnpm test hooks/__tests__/useFavorites.test.ts` → expect passing.
- [ ] Commit:

```bash
git add hooks/__tests__/useFavorites.test.ts
git commit -m "test: add tests for useFavorites hook"
```

### Task 1.5: Component test for `PropertyFormFields` validation surface

**Files:**
- Create: `components/__tests__/PropertyFormFields.test.tsx`

- [ ] **Read** `components/PropertyFormFields.tsx` to confirm it renders fields and surfaces error text.
- [ ] **Write the failing test**:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropertyFormFields from '@/components/PropertyFormFields'

const noop = {
  form: { title: '', price: '', type: 'rumah', listingType: 'jual', city: '' },
  errors: {},
  onChange: jest.fn(),
}

describe('PropertyFormFields', () => {
  it('renders core inputs', () => {
    render(<PropertyFormFields {...noop} />)
    expect(screen.getByLabelText(/judul/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/harga/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/kota/i)).toBeInTheDocument()
  })

  it('shows validation error message when present', () => {
    render(<PropertyFormFields {...noop} errors={{ title: 'Judul wajib diisi' }} />)
    expect(screen.getByText('Judul wajib diisi')).toBeInTheDocument()
  })

  it('calls onChange when typing in title', async () => {
    const onChange = jest.fn()
    render(<PropertyFormFields {...noop} onChange={onChange} />)
    await userEvent.type(screen.getByLabelText(/judul/i), 'Rumah')
    expect(onChange).toHaveBeenCalled()
  })
})
```

- [ ] **Adjust** props/label matchers to the real component API. The labels and prop names here are guessed from the admin form pattern — read the file and align.
- [ ] Run: `pnpm test components/__tests__/PropertyFormFields.test.tsx` → expect 3 passing.
- [ ] Commit:

```bash
git add components/__tests__/PropertyFormFields.test.tsx
git commit -m "test: add component tests for PropertyFormFields"
```

---

## Phase 2 — Persistent Rate Limiter

### Task 2.1: Schema for rate-limit table

**Files:**
- Modify: `db/schema.ts` (append before final export)

- [ ] Add the table at the bottom of `db/schema.ts`:

```typescript
import { text, integer, timestamp, index } from "drizzle-orm/pg-core"
// (keep existing imports — add `index` to the import list)

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),
    resetAt: timestamp("reset_at").notNull(),
  },
  (table) => ({
    resetAtIdx: index("rate_limits_reset_at_idx").on(table.resetAt),
  }),
)
```

- [ ] Run: `pnpm exec drizzle-kit generate`
- [ ] Inspect the generated migration under `drizzle/0004_*.sql`. It should `CREATE TABLE rate_limits` and the index.
- [ ] Apply locally: `pnpm exec drizzle-kit migrate`
- [ ] Commit (schema + migration together):

```bash
git add db/schema.ts drizzle/0004_*.sql
git commit -m "feat(db): add rate_limits table for persistent rate limiting"
```

### Task 2.2: Refactor `lib/rate-limit.ts` to use a driver

**Files:**
- Modify: `lib/rate-limit.ts`

- [ ] Replace the file with a driver-based implementation that keeps the **exact same export shape** (`rateLimit`, `getRateLimitKey`):

```typescript
export interface RateLimitDriver {
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>
  reset?(key: string): Promise<void>
}

import { db } from "@/db"
import { rateLimits } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

class DbDriver implements RateLimitDriver {
  async hit(key: string, windowMs: number) {
    const now = Date.now()
    const [existing] = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).limit(1)
    if (!existing || existing.resetAt.getTime() <= now) {
      const resetAt = new Date(now + windowMs)
      await db
        .insert(rateLimits)
        .values({ key, count: 1, resetAt })
        .onConflictDoUpdate({ target: rateLimits.key, set: { count: 1, resetAt } })
      return { count: 1, resetAt: now + windowMs }
    }
    const [updated] = await db
      .update(rateLimits)
      .set({ count: sql`${rateLimits.count} + 1` })
      .where(eq(rateLimits.key, key))
      .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt })
    return { count: updated.count, resetAt: updated.resetAt.getTime() }
  }
  async reset(key: string) {
    await db.delete(rateLimits).where(eq(rateLimits.key, key))
  }
}

class MemoryDriver implements RateLimitDriver {
  private store = new Map<string, { count: number; resetAt: number }>()
  async hit(key: string, windowMs: number) {
    const now = Date.now()
    const cur = this.store.get(key)
    if (!cur || cur.resetAt <= now) {
      const entry = { count: 1, resetAt: now + windowMs }
      this.store.set(key, entry)
      return entry
    }
    cur.count += 1
    return cur
  }
  async reset(key: string) { this.store.delete(key) }
}

const driver: RateLimitDriver = process.env.DATABASE_URL
  ? new DbDriver()
  : new MemoryDriver()

export async function rateLimit(
  key: string,
  options: { windowMs?: number; max?: number } = {},
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const { windowMs = 15 * 60 * 1000, max = 5 } = options
  const { count, resetAt } = await driver.hit(key, windowMs)
  if (count > max) return { success: false, remaining: 0, resetAt }
  return { success: true, remaining: max - count, resetAt }
}

export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`
}
```

- [ ] Run: `pnpm typecheck` — every call site must `await` the result. Find them with:

```bash
grep -rn "rateLimit(" app lib --include="*.ts" --include="*.tsx"
```

- [ ] **Update all call sites** to `await` and handle errors. The known sites are:
  - `lib/auth.ts:43` — `const limit = rateLimit(...)` → `const limit = await rateLimit(...)`
  - `app/api/properties/route.ts:111` and `app/api/properties/[id]/route.ts:73,143` — same.
- [ ] Run: `pnpm typecheck` → expect 0 errors.
- [ ] Run: `pnpm test lib/__tests__/rate-limit.test.ts` → expect 4 passing. **Note:** the in-memory test path still works because `MemoryDriver` is used when `DATABASE_URL` is unset (the test env should not set it).
- [ ] Commit:

```bash
git add lib/rate-limit.ts lib/auth.ts app/api/properties/route.ts app/api/properties/[id]/route.ts
git commit -m "feat(rate-limit): driver-based persistent rate limiter (db-backed)"
```

### Task 2.3: Update tests for async `rateLimit`

**Files:**
- Modify: `lib/__tests__/rate-limit.test.ts`
- Modify: `app/api/properties/__tests__/route.test.ts`

- [ ] In `lib/__tests__/rate-limit.test.ts`, change every `rateLimit(...)` call to `await rateLimit(...)` and wrap `it` bodies in async. Specifically, replace the `it(...)` blocks with `it(..., async () => { ... await rateLimit(...) ... })` and add `await` to every `rateLimit()` invocation.
- [ ] In `app/api/properties/__tests__/route.test.ts`, the `rateLimit` mock currently returns synchronously. Since the production code now `await`s, that's fine — Promises auto-resolve. No change needed unless tests fail.
- [ ] Run: `pnpm test` → expect all green.
- [ ] Commit:

```bash
git add lib/__tests__/rate-limit.test.ts app/api/properties/__tests__/route.test.ts
git commit -m "test: adapt tests to async rateLimit API"
```

---

## Phase 3 — SEO

### Task 3.1: JSON-LD structured data on property detail

**Files:**
- Modify: `app/properti/[id]/page.tsx`

- [ ] **Read** the current file to confirm exports.
- [ ] Add this `ld+json` script inside the returned JSX, just under the `<PropertyGalleryClient />` element (around line 88). First add a helper at the top of the file (after the `getProperty` function):

```typescript
function buildJsonLd(property: typeof properties.$inferSelect, images: Array<typeof propertyImages.$inferSelect>) {
  const primary = images.find((i) => i.isPrimary) ?? images[0]
  return {
    "@context": "https://schema.org",
    "@type": "Residence" as const,
    name: property.title,
    description: property.description ?? undefined,
    url: `/properti/${property.id}`,
    image: primary ? [primary.url] : undefined,
    address: {
      "@type": "PostalAddress" as const,
      addressLocality: property.city,
      streetAddress: property.address ?? undefined,
      addressCountry: "ID",
    },
    geo: property.lat && property.lng ? {
      "@type": "GeoCoordinates" as const,
      latitude: Number(property.lat),
      longitude: Number(property.lng),
    } : undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    offers: {
      "@type": "Offer" as const,
      price: property.price,
      priceCurrency: "IDR",
      availability: property.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }
}
```

- [ ] Inject the script tag inside the container `<div>` (line 87). After the gallery, add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(property, images)) }}
/>
```

- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Run: `pnpm dev`, visit a property URL, view source. Confirm one `<script type="application/ld+json">` block with `Residence` schema. Validate at https://validator.schema.org/ (paste the JSON).
- [ ] Commit:

```bash
git add app/properti/[id]/page.tsx
git commit -m "feat(seo): add JSON-LD Residence schema to property detail"
```

### Task 3.2: Sitemap

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Write** the sitemap (Next 16 App Router convention):

```typescript
import type { MetadataRoute } from "next"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { BRAND } from "@/lib/brand"

const BASE = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select({ id: properties.id, updatedAt: properties.createdAt })
    .from(properties)
    .where(eq(properties.status, "active"))
    .orderBy(desc(properties.createdAt))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/properti`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/peta`, changeFrequency: "daily", priority: 0.7 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = rows.map((r) => ({
    url: `${BASE}/properti/${r.id}`,
    lastModified: r.updatedAt ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}
```

- [ ] Run: `pnpm dev`, visit `http://localhost:3000/sitemap.xml` — confirm valid XML listing routes.
- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Commit:

```bash
git add app/sitemap.ts
git commit -m "feat(seo): add dynamic sitemap.xml"
```

### Task 3.3: Robots

**Files:**
- Create: `app/robots.ts`

- [ ] **Write**:

```typescript
import type { MetadataRoute } from "next"

const BASE = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/masuk", "/daftar", "/profil"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
```

- [ ] Run: `pnpm dev`, visit `http://localhost:3000/robots.txt` — confirm output.
- [ ] Commit:

```bash
git add app/robots.ts
git commit -m "feat(seo): add robots.txt disallowing admin/auth/profile"
```

### Task 3.4: Enhance `generateMetadata` with Twitter card and canonical

**Files:**
- Modify: `app/properti/[id]/page.tsx` (the `generateMetadata` function, lines 51-75)

- [ ] Replace the return object with:

```typescript
const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
return {
  title: `${property.title} — ${formattedPrice} | ${BRAND.name}`,
  description,
  alternates: { canonical: `${baseUrl}/properti/${property.id}` },
  openGraph: {
    title: property.title,
    description,
    type: "article",
    url: `${baseUrl}/properti/${property.id}`,
    siteName: BRAND.name,
    locale: "id_ID",
    images: primaryImage ? [{ url: primaryImage.url, width: 1200, height: 630, alt: property.title }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: property.title,
    description,
    images: primaryImage ? [primaryImage.url] : [],
  },
}
```

- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Commit:

```bash
git add app/properti/[id]/page.tsx
git commit -m "feat(seo): add twitter card, canonical, locale to property metadata"
```

---

## Phase 4 — Admin Bulk Operations + Soft Delete + Audit Log

### Task 4.1: Schema — `deleted_at` on properties, `admin_actions` table

**Files:**
- Modify: `db/schema.ts`

- [ ] Add `deletedAt: timestamp("deleted_at")` to the `properties` table (after `createdAt`):

```typescript
deletedAt: timestamp("deleted_at"),
```

- [ ] Add a new `adminActions` table at the bottom (after `rateLimits`):

```typescript
export const adminActions = pgTable("admin_actions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  adminId: text("admin_id").references(() => profiles.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
})
```

- [ ] Run: `pnpm exec drizzle-kit generate` — review the migration adds `deleted_at` column and creates `admin_actions`.
- [ ] Apply: `pnpm exec drizzle-kit migrate`.
- [ ] Commit:

```bash
git add db/schema.ts drizzle/0005_*.sql
git commit -m "feat(db): add soft delete on properties and admin_actions audit log"
```

### Task 4.2: Update public property queries to filter `deleted_at IS NULL`

**Files:**
- Modify: `app/properti/page.tsx`
- Modify: `app/properti/[id]/page.tsx`
- Modify: `lib/db-helpers.ts`
- Modify: any other query against `properties` (grep first)

- [ ] Run: `grep -rn "from(properties)" app lib` to enumerate every site.
- [ ] For every `where(...)` chain that queries `properties`, append `isNull(properties.deletedAt)`. Add `isNull` to the drizzle-orm import in each file.
- [ ] In `app/properti/[id]/page.tsx:23-49`, change the `getProperty` to add `.where(and(eq(properties.id, id), isNull(properties.deletedAt)))`. Add `and` to the import.
- [ ] In `lib/db-helpers.ts`, **do not** filter in the helper — the caller decides (so admin routes can still see deleted). Just add a code comment:

```typescript
// NOTE: callers must filter `isNull(properties.deletedAt)` for public reads.
// Admin routes may omit the filter to inspect soft-deleted rows.
```

- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Run: `pnpm test` → all green.
- [ ] Commit:

```bash
git add app/properti/page.tsx app/properti/[id]/page.tsx lib/db-helpers.ts
git commit -m "feat(public): hide soft-deleted properties from catalog and detail"
```

### Task 4.3: Soft-delete on `DELETE /api/properties/[id]`

**Files:**
- Modify: `app/api/properties/[id]/route.ts:132-156`

- [ ] Replace the `DELETE` handler body. Keep all auth/rate-limit checks. Replace the hard `db.delete(...)` with:

```typescript
const { id } = await params
const now = new Date()
const [updated] = await db
  .update(properties)
  .set({ deletedAt: now, status: "archived" })
  .where(eq(properties.id, id))
  .returning({ id: properties.id })

if (!updated) {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

await db.insert(adminActions).values({
  adminId: session.user.id ?? null,
  action: "property.soft_delete",
  entityType: "property",
  entityId: id,
})

return NextResponse.json({ ok: true })
```

- [ ] Add `adminActions` to the imports from `@/db/schema`.
- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Commit:

```bash
git add app/api/properties/[id]/route.ts
git commit -m "feat(admin): soft delete properties with audit log"
```

### Task 4.4: Bulk status endpoint

**Files:**
- Create: `app/api/properties/bulk/route.ts`

- [ ] **Write** the route. The UI at `app/admin/properti/page.tsx:134-159` already loops N PATCH calls; we replace with one bulk call:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { db } from "@/db"
import { properties, adminActions } from "@/db/schema"
import { inArray } from "drizzle-orm"
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"

const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
  status: z.enum(["active", "sold", "rented", "archived"]),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for") ?? "unknown"
    const limit = await rateLimit(getRateLimitKey(ip, "property-bulk"), { windowMs: 60_000, max: 10 })
    if (!limit.success) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 })
    }

    const body = await req.json()
    const parsed = bulkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validasi gagal", details: parsed.error.flatten() }, { status: 400 })
    }
    const { ids, status } = parsed.data

    const updated = await db
      .update(properties)
      .set({ status })
      .where(inArray(properties.id, ids))
      .returning({ id: properties.id })

    if (updated.length > 0) {
      await db.insert(adminActions).values(
        updated.map((u) => ({
          adminId: session.user.id ?? null,
          action: `property.bulk_status.${status}`,
          entityType: "property",
          entityId: u.id,
          metadata: JSON.stringify({ bulk: true, count: ids.length }),
        })),
      )
    }

    return NextResponse.json({ updated: updated.length, requested: ids.length })
  } catch (error) {
    console.error("[PATCH /api/properties/bulk]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for") ?? "unknown"
    const limit = await rateLimit(getRateLimitKey(ip, "property-bulk-delete"), { windowMs: 60_000, max: 10 })
    if (!limit.success) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 })
    }

    const body = await req.json()
    const parsed = z.object({ ids: z.array(z.string().min(1)).min(1).max(100) }).safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validasi gagal" }, { status: 400 })
    }

    const now = new Date()
    const updated = await db
      .update(properties)
      .set({ deletedAt: now, status: "archived" })
      .where(inArray(properties.id, parsed.data.ids))
      .returning({ id: properties.id })

    if (updated.length > 0) {
      await db.insert(adminActions).values(
        updated.map((u) => ({
          adminId: session.user.id ?? null,
          action: "property.bulk_soft_delete",
          entityType: "property",
          entityId: u.id,
          metadata: JSON.stringify({ bulk: true, count: parsed.data.ids.length }),
        })),
      )
    }

    return NextResponse.json({ updated: updated.length, requested: parsed.data.ids.length })
  } catch (error) {
    console.error("[DELETE /api/properties/bulk]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
```

- [ ] Run: `pnpm typecheck` → 0 errors.
- [ ] Commit:

```bash
git add app/api/properties/bulk/route.ts
git commit -m "feat(admin): bulk PATCH/DELETE for property status and soft-delete"
```

### Task 4.5: Test the bulk route

**Files:**
- Create: `app/api/properties/__tests__/bulk.test.ts`

- [ ] **Write** the tests (same mock pattern as Task 1.3):

```typescript
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(async () => ({ success: true, remaining: 9, resetAt: Date.now() + 60_000 })),
  getRateLimitKey: jest.fn((id: string, action: string) => `${action}:${id}`),
}))
jest.mock('@/db', () => ({
  db: {
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]),
        }),
      }),
    }),
    insert: jest.fn().mockReturnValue({ values: jest.fn().mockResolvedValue(undefined) }),
  },
}))

import { PATCH, DELETE } from '@/app/api/properties/bulk/route'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

const mockSession = getServerSession as jest.Mock
function req(body: any) {
  return new NextRequest(new Request('http://localhost/api/properties/bulk', {
    method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' },
  }))
}

describe('PATCH /api/properties/bulk', () => {
  it('403 for non-admin', async () => {
    mockSession.mockResolvedValue({ user: { role: 'buyer' } })
    const res = await PATCH(req({ ids: ['p1'], status: 'active' }) as any)
    expect(res.status).toBe(403)
  })

  it('400 on empty ids', async () => {
    mockSession.mockResolvedValue({ user: { id: 'a1', role: 'admin' } })
    const res = await PATCH(req({ ids: [], status: 'active' }) as any)
    expect(res.status).toBe(400)
  })

  it('400 on invalid status', async () => {
    mockSession.mockResolvedValue({ user: { id: 'a1', role: 'admin' } })
    const res = await PATCH(req({ ids: ['p1'], status: 'banana' }) as any)
    expect(res.status).toBe(400)
  })

  it('returns updated count', async () => {
    mockSession.mockResolvedValue({ user: { id: 'a1', role: 'admin' } })
    const res = await PATCH(req({ ids: ['p1', 'p2'], status: 'sold' }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.updated).toBe(2)
  })
})

describe('DELETE /api/properties/bulk', () => {
  it('returns updated count', async () => {
    mockSession.mockResolvedValue({ user: { id: 'a1', role: 'admin' } })
    const res = await DELETE(req({ ids: ['p1'] }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.updated).toBe(1)
  })
})
```

- [ ] Run: `pnpm test app/api/properties/__tests__/bulk.test.ts` → expect 5 passing.
- [ ] Commit:

```bash
git add app/api/properties/__tests__/bulk.test.ts
git commit -m "test: cover /api/properties/bulk"
```

### Task 4.6: Wire the admin UI to the new bulk endpoint

**Files:**
- Modify: `app/admin/properti/page.tsx`

- [ ] Replace `handleBulkStatus` (lines 134-159) with:

```typescript
const handleBulkStatus = async (status: string) => {
  if (!confirm(`Ubah ${selectedIds.size} properti ke "${STATUS_LABELS[status] ?? status}"?`)) return
  setBusy(true)
  try {
    const res = await fetch(`/api/properties/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selectedIds], status }),
    })
    if (!res.ok) throw new Error("Gagal")
    const data = await res.json()
    toast.success(`${data.updated} properti diubah ke ${STATUS_LABELS[status] ?? status}`)
  } catch {
    toast.error("Gagal mengubah status")
  } finally {
    fetchProperties()
    setBusy(false)
  }
}
```

- [ ] Replace `handleBulkDelete` (lines 161-182) with:

```typescript
const handleBulkDelete = async () => {
  if (!confirm(`Hapus ${selectedIds.size} properti? Tindakan ini tidak bisa dibatalkan.`)) return
  setBusy(true)
  try {
    const res = await fetch(`/api/properties/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selectedIds] }),
    })
    if (!res.ok) throw new Error("Gagal")
    const data = await res.json()
    toast.success(`${data.updated} properti dipindahkan ke arsip`)
  } catch {
    toast.error("Gagal menghapus properti")
  } finally {
    fetchProperties()
    setBusy(false)
  }
}
```

- [ ] Run: `pnpm dev`, log in as admin, select 3 properties → Ubah Status → confirm dialog → confirm toast says "3 properti diubah ke Aktif". Repeat for Hapus.
- [ ] Run: `pnpm test` → all green.
- [ ] Commit:

```bash
git add app/admin/properti/page.tsx
git commit -m "feat(admin): wire bulk UI to /api/properties/bulk"
```

---

## Phase 5 — CI

### Task 5.1: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Write**:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: postgres://stub:stub@localhost:5432/stub
      NEXTAUTH_SECRET: ci-stub-secret
      NEXTAUTH_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
```

- [ ] Run: `git add .github/workflows/ci.yml && git commit -m "ci: add lint+typecheck+test workflow"`

> Note: `pnpm build` is intentionally not in CI to save minutes. Run it locally before release. The `DATABASE_URL` stub is required because `drizzle.config.ts` and `db/index.ts` import it at module load.

### Task 5.2: Enable coverage gate

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] Change the last step to:

```yaml
      - run: pnpm test -- --coverage --coverageThreshold='{"global":{"lines":50,"statements":50}}'
```

- [ ] Commit:

```bash
git add .github/workflows/ci.yml
git commit -m "ci: enforce 50% coverage threshold"
```

---

## Self-Review Checklist

Run before declaring done:

- [ ] `pnpm lint` → 0 errors
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm test -- --coverage` → all green, coverage ≥ 50% lines/statements
- [ ] `pnpm build` → succeeds locally
- [ ] Manual smoke:
  - [ ] Visit `/sitemap.xml` — XML renders
  - [ ] Visit `/robots.txt` — text renders
  - [ ] View source of any `/properti/[id]` — JSON-LD `Residence` script present
  - [ ] Log in as admin, bulk-update 3 properties, confirm single network call, audit row in `admin_actions`
  - [ ] Soft-delete a property, visit `/properti/[id]` → 404
- [ ] All commits pushed, PR description references this plan
