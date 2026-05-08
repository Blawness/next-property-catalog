# Archive Property Feature — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `archived` status to properties so admins can archive concluded listings via edit form. Archived properties only visible in admin dashboard.

**Architecture:** Extend the existing `status` PostgreSQL enum with `"archived"` value. Fix a bug in the edit page that strips `status` from PATCH body. Add filter/badge in admin list. Add 404 guard on public detail page.

**Tech Stack:** Drizzle ORM, PostgreSQL (Neon), Zod validation, Next.js App Router

---

### Task 1: Add `archived` to database schema and types

**Files:**
- Modify: `db/schema.ts:20`
- Modify: `lib/types.ts:3`

- [ ] **Step 1: Add `"archived"` to statusEnum**

Edit `db/schema.ts` line 20, change:

```ts
export const statusEnum = pgEnum("status", ["active", "sold", "rented"])
```

to:

```ts
export const statusEnum = pgEnum("status", ["active", "sold", "rented", "archived"])
```

- [ ] **Step 2: Add `"archived"` to PropertyStatus type**

Edit `lib/types.ts` line 3, change:

```ts
export type PropertyStatus = "active" | "sold" | "rented"
```

to:

```ts
export type PropertyStatus = "active" | "sold" | "rented" | "archived"
```

- [ ] **Step 3: Run DB migration**

```bash
pnpm exec drizzle-kit generate
```

If the generated SQL doesn't include `ALTER TYPE status ADD VALUE 'archived'`, run it manually:

```bash
# Connect to Neon and run:
# ALTER TYPE status ADD VALUE 'archived';
```

Then apply:

```bash
pnpm exec drizzle-kit migrate
```

- [ ] **Step 4: Verify typecheck passes**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add db/schema.ts lib/types.ts drizzle/
git commit -m "feat: add archived status to property schema and types"
```

---

### Task 2: Add `archived` to PATCH API validation

**Files:**
- Modify: `app/api/properties/[id]/route.ts:50`

- [ ] **Step 1: Add `"archived"` to Zod enum**

Edit `app/api/properties/[id]/route.ts` line 50, change:

```ts
  status: z.enum(["active", "sold", "rented"]).optional(),
```

to:

```ts
  status: z.enum(["active", "sold", "rented", "archived"]).optional(),
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/properties/[id]/route.ts
git commit -m "feat: allow archived status in property update API"
```

---

### Task 3: Fix edit form — enable status updates and add archived option

**Files:**
- Modify: `app/admin/properti/[id]/edit/page.tsx:82-84` (remove status strip)
- Modify: `app/admin/properti/[id]/edit/page.tsx:137-139` (add SelectItem)

- [ ] **Step 1: Remove the bug that strips status from PATCH body**

Edit `app/admin/properti/[id]/edit/page.tsx` lines 82-84. Change:

```ts
    const body: Record<string, string | string[] | null> = { ...fields, imageUrls }
    const { status: _s, ...patchBody } = body
    void _s
```

to:

```ts
    const body: Record<string, string | string[] | null> = { ...fields, imageUrls }
```

And change line 89 from:

```ts
      body: JSON.stringify(patchBody),
```

to:

```ts
      body: JSON.stringify(body),
```

- [ ] **Step 2: Add "Diarsipkan" option to status dropdown**

Edit `app/admin/properti/[id]/edit/page.tsx` after line 139 (`<SelectItem value="rented">Tersewa</SelectItem>`), add:

```tsx
                    <SelectItem value="archived">Diarsipkan</SelectItem>
```

- [ ] **Step 3: Verify lint and typecheck**

```bash
pnpm lint && pnpm exec tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/properti/[id]/edit/page.tsx
git commit -m "fix: enable status updates in edit form, add archived option"
```

---

### Task 4: Add archived filter and badge to admin property list

**Files:**
- Modify: `app/admin/properti/page.tsx:148-151` (add filter SelectItem)
- Modify: `app/admin/properti/page.tsx:238-241` (badge logic for desktop)
- Modify: `app/admin/properti/page.tsx:306-307` (badge logic for mobile)

- [ ] **Step 1: Add "Diarsipkan" to status filter dropdown**

Edit `app/admin/properti/page.tsx` after line 150 (`<SelectItem value="rented">Tersewa</SelectItem>`), add:

```tsx
                <SelectItem value="archived">Diarsipkan</SelectItem>
```

- [ ] **Step 2: Update desktop table badge to handle `archived`**

Edit `app/admin/properti/page.tsx` lines 238-241. Change:

```tsx
                          <Badge variant={
                            item.status === "active" ? "default" : "secondary"
                          }>
                            {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : "Tersewa"}
                          </Badge>
```

to:

```tsx
                          <Badge variant={
                            item.status === "active" ? "default" : item.status === "archived" ? "outline" : "secondary"
                          }>
                            {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : item.status === "rented" ? "Tersewa" : "Diarsipkan"}
                          </Badge>
```

- [ ] **Step 3: Update mobile card badge to handle `archived`**

Edit `app/admin/properti/page.tsx` lines 306-307. Change:

```tsx
                      <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-[10px]">
                        {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : "Tersewa"}
                      </Badge>
```

to:

```tsx
                      <Badge variant={item.status === "active" ? "default" : item.status === "archived" ? "outline" : "secondary"} className="text-[10px]">
                        {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : item.status === "rented" ? "Tersewa" : "Diarsipkan"}
                      </Badge>
```

- [ ] **Step 4: Verify lint and typecheck**

```bash
pnpm lint && pnpm exec tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/properti/page.tsx
git commit -m "feat: add archived filter and badge to admin property list"
```

---

### Task 5: Block archived properties on public detail page

**Files:**
- Modify: `app/properti/[id]/page.tsx:77-80`

- [ ] **Step 1: Add archived guard before notFound check**

Edit `app/properti/[id]/page.tsx` lines 77-80. Change:

```tsx
  if (!data) notFound()

  const { property, images, agent } = data
```

to:

```tsx
  if (!data || data.property.status === "archived") notFound()

  const { property, images, agent } = data
```

- [ ] **Step 2: Verify lint and typecheck**

```bash
pnpm lint && pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/properti/[id]/page.tsx
git commit -m "fix: return 404 for archived properties on public detail page"
```

---

### Task 6: Full verification

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: all pass with no errors.

---

### Manual Test Checklist

1. Buka `/admin/properti/[id]/edit` — pastikan dropdown status ada opsi "Diarsipkan"
2. Ubah properti jadi "Diarsipkan" dan simpan — pastikan tersimpan
3. Buka `/admin/properti?status=archived` — pastikan properti muncul
4. Buka `/properti/[id]` untuk properti archived — pastikan 404
5. Buka homepage dan `/properti` — pastikan properti archived tidak muncul
6. Buka `/peta` — pastikan properti archived tidak muncul
