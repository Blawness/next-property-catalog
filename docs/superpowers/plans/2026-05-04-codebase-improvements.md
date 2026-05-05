# Codebase Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Implement 10 improvements (5 FE + 5 BE) covering error handling, performance, accessibility, and security.

**Architecture:** Each task is independent — modify 1-3 files per task. Changes are mechanical and follow existing codebase patterns.

**Tech Stack:** Next.js 16, Drizzle ORM, Zod, shadcn/ui, Tailwind CSS v4

---

### Task B1: Fix `propertiesThisMonth` Stats

**Files:** `app/api/admin/stats/route.ts:29-33`

- [ ] Add `gte` import from drizzle-orm: `import { eq, count, gte } from "drizzle-orm"`
- [ ] Replace lines 29-32 with:

```typescript
const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
const [monthResult] = await db
  .select({ count: count() })
  .from(properties)
  .where(and(eq(properties.status, "active"), gte(properties.createdAt, startOfMonth)))
```

(Need `and` import too.)
- [ ] Commit: `git add app/api/admin/stats/route.ts && git commit -m "fix: add date filter to propertiesThisMonth stat"`

---

### Task B2: Fix N+1 Agent Property Counts

**Files:** `app/api/admin/agents/route.ts:37-45`

- [ ] Add `inArray` to drizzle-orm import
- [ ] Replace the N+1 loop (lines 37-45) with:

```typescript
const agentIds = agents.map((a) => a.id)
const countRows = agentIds.length > 0
  ? await db
      .select({ agentId: properties.agentId, count: count() })
      .from(properties)
      .where(inArray(properties.agentId, agentIds))
      .groupBy(properties.agentId)
  : []

const countMap = new Map<string, number>()
for (const row of countRows) {
  if (row.agentId) countMap.set(row.agentId, row.count)
}

const agentsWithCounts = agents.map((agent) => ({
  ...agent,
  propertyCount: countMap.get(agent.id) ?? 0,
}))
```

- [ ] Commit: `git add app/api/admin/agents/route.ts && git commit -m "perf: replace N+1 agent counts with groupBy query"`

---

### Task B3: Rate Limiting for Mutation Endpoints

**Files:** `lib/rate-limit.ts` + all mutation API routes

- [ ] Create helper `lib/rate-limit.ts` append:

```typescript
import { NextRequest } from "next/server"

export function checkMutationRateLimit(req: NextRequest, action: string): { success: boolean; error?: NextResponse } {
  // Skip rate limiting in development
  // No NextResponse import needed here, return string error
}
```

Better approach: add rate limit wrapper inline in each route. Simpler: add a helper function.

Actually, simplest approach: add rate limit check at the start of each mutation handler:

```typescript
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"

// Inside handler:
const ip = req.headers.get("x-forwarded-for") ?? "unknown"
const limit = rateLimit(getRateLimitKey(ip, "action-name"), { windowMs: 60_000, max: 30 })
if (!limit.success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 })
}
```

Add to: `POST /api/properties`, `PATCH/DELETE /api/properties/[id]`, `POST/PATCH/DELETE /api/admin/agents`, `PATCH /api/profil`, `POST /api/favorites`

- [ ] Modify each file, import `rateLimit` + `getRateLimitKey`, add check
- [ ] Commit per file group

---

### Task B4: Numeric Field Validation

**Files:** `app/api/properties/route.ts:19-22` + `app/api/properties/[id]/route.ts:54-57`

- [ ] In POST schema, change:
```typescript
landArea: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
buildingArea: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
bedrooms: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
bathrooms: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
```

- [ ] Same change for PATCH schema in `[id]/route.ts`
- [ ] Commit: `git add app/api/properties/route.ts app/api/properties/\[id\]/route.ts && git commit -m "fix: validate numeric fields in property API"`

---

### Task B5: Caching for Public Pages

**Files:** `app/page.tsx`, `app/properti/page.tsx`, `app/properti/[id]/page.tsx`, `app/peta/page.tsx`

- [ ] Add to top of each file (after imports):
```typescript
export const revalidate = 60 // Homepage + Catalog
export const revalidate = 30 // Detail
export const revalidate = 120 // Peta
```

- [ ] Commit per file group

---

### Task F1: Error States in Admin Pages

**Files:** `app/admin/page.tsx`, `app/admin/agent/page.tsx`, `app/admin/properti/page.tsx`, `app/admin/AdminLayoutClient.tsx`, `hooks/useFavorites.ts`

- [ ] Admin dashboard: add `error` state, show error UI
- [ ] Admin agent: add `error` state, show error UI  
- [ ] Admin properti: add `error` state, show error UI
- [ ] AdminLayoutClient: replace `return null` with loading skeleton
- [ ] useFavorites: expose error state

For each admin page, pattern:
```typescript
const [error, setError] = useState("")

// In fetch callback:
.catch((err) => { setError(err.message); setLoading(false) })

// In render, before content:
if (error) return (
  <div className="text-center py-12">
    <p className="text-destructive font-medium">Gagal memuat data</p>
    <p className="text-sm text-muted-foreground mt-1">{error}</p>
    <Button variant="outline" className="mt-4" onClick={fetchFn}>Coba Lagi</Button>
  </div>
)
```

For AdminLayoutClient:
```typescript
if (status === "loading") return (
  <div className="h-screen flex items-center justify-center bg-muted/30">
    <Loader2 className="animate-spin text-muted-foreground" size={24} />
  </div>
)
```

For useFavorites:
```typescript
const [error, setError] = useState("")
// In fetch:
.catch((err) => { setError(err.message); setFavorites([]) })
// Return: { favorites, loadingFavs, error }
```

- [ ] Commit per file

---

### Task F2: Mobile Filter Drawer

**Files:** `app/properti/page.tsx`

- [ ] Import Sheet component
- [ ] Add mobile filter button + Sheet drawer below `lg` breakpoint
- [ ] Wrap `PropertyFilter` in a reusable way

```typescript
// After the aside, add:
<div className="lg:hidden mb-4">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="sm">
        <SlidersHorizontal size={14} className="mr-1" /> Filter
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Filter Properti</SheetTitle>
      </SheetHeader>
      <div className="py-4">
        <PropertyFilter />
      </div>
    </SheetContent>
  </Sheet>
</div>
```

Need imports: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"` and `import { SlidersHorizontal } from "lucide-react"`.

- [ ] Typecheck, commit

---

### Task F3: Admin Filter via URL

**Files:** `app/admin/properti/page.tsx`

- [ ] Import `useSearchParams`, `useRouter` from next/navigation
- [ ] Replace local filter state with URL params
- [ ] Sync page/filter changes to URL, read initial values from URL

```typescript
import { useSearchParams, useRouter } from "next/navigation"

const searchParams = useSearchParams()
const router = useRouter()

const page = parseInt(searchParams.get("page") ?? "1", 10)
const search = searchParams.get("search") ?? ""
const statusFilter = searchParams.get("status") ?? ""
const typeFilter = searchParams.get("type") ?? ""

const setFilters = (updates: Record<string, string>) => {
  const params = new URLSearchParams(searchParams.toString())
  for (const [k, v] of Object.entries(updates)) {
    if (v) params.set(k, v)
    else params.delete(k)
  }
  router.push(`/admin/properti?${params.toString()}`)
}
```

- [ ] Typecheck, commit

---

### Task F4: Lightbox Keyboard + Accessibility

**Files:** `components/PropertyGalleryClient.tsx`

- [ ] Add `useEffect` for keyboard handler when lightbox is open
- [ ] Add ARIA attributes to lightbox overlay
- [ ] Add focus management

```typescript
import { useEffect, useRef } from "react"

// In component:
const lightboxRef = useRef<HTMLDivElement>(null)
const previousFocusRef = useRef<HTMLElement | null>(null)

const openLightbox = (index: number) => {
  previousFocusRef.current = document.activeElement as HTMLElement
  setLightboxIndex(index)
}
const closeLightbox = () => {
  setLightboxIndex(null)
  previousFocusRef.current?.focus()
}

useEffect(() => {
  if (lightboxIndex === null) return
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") prev()
    if (e.key === "ArrowRight") next()
  }
  document.addEventListener("keydown", handleKeyDown)
  lightboxRef.current?.focus()
  return () => document.removeEventListener("keydown", handleKeyDown)
}, [lightboxIndex])

// On overlay div:
<div
  ref={lightboxRef}
  role="dialog"
  aria-modal="true"
  aria-label={`Galeri foto: ${title}`}
  tabIndex={-1}
  ...
>
```

- [ ] Add aria-label to thumbnail buttons: `aria-label={`Lihat foto ${i + 1} dari ${images.length}`}`
- [ ] Typecheck, commit

---

### Task F5: Dead Code Cleanup

**Files:** Delete 4 unused files

- [ ] `rm components/PropertyGallery.tsx`
- [ ] `rm components/EmptyState.tsx`
- [ ] `rm components/SearchBar.tsx`
- [ ] `rm lib/auth-client.ts`
- [ ] Check no imports broken, run typecheck
- [ ] Commit: `git rm ... && git commit -m "chore: remove unused components and lib"`

---

### Verification

- [ ] `pnpm lint` — no errors
- [ ] `pnpm exec tsc --noEmit` — no errors
- [ ] `pnpm test` — 2 tests pass
- [ ] `pnpm build` — succeeds
