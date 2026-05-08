# Archive Property Feature — Design Spec

**Date:** 2026-05-08
**Status:** Approved

## Overview

Add a new `archived` status to the property system. Admin can mark properties as archived via the edit form. Archived properties are only visible in the admin dashboard — they do not appear on any public-facing pages (homepage, catalog, map, or detail).

## Design

### 1. Database — Add `archived` to status enum

- `db/schema.ts`: Add `"archived"` to `pgEnum("status", [...])` (line 20)
- Drizzle Kit migration: `pnpm exec drizzle-kit generate` → `pnpm exec drizzle-kit migrate`
- If PostgreSQL rejects `ALTER TYPE ADD VALUE`, run raw SQL migration manually

### 2. Types & Validation

- `lib/types.ts`: Add `"archived"` to `PropertyStatus` type
- `app/api/properties/[id]/route.ts`: Add `"archived"` to `z.enum([...])` in PATCH validation schema

### 3. Admin Edit Form (`app/admin/properti/[id]/edit/page.tsx`)

- **Bug fix:** Remove lines 82-84 that strip `status` from the PATCH body. Currently `const { status: _s, ...patchBody } = body` prevents status from being sent to the API.
- Add `<SelectItem value="archived">Diarsipkan</SelectItem>` to the status dropdown.

### 4. Admin Property List (`app/admin/properti/page.tsx`)

- Add `<SelectItem value="archived">Diarsipkan</SelectItem>` to status filter dropdown
- Add badge case for `"archived"` with appropriate styling (e.g., `variant="outline"`)

### 5. Public Detail Page (`app/properti/[id]/page.tsx`)

- Add guard: if `property.status === "archived"`, return `notFound()` (404) so archived properties cannot be accessed via direct URL.

### 6. No Changes Needed

- **Homepage** (`app/page.tsx`): Already filters `eq(status, "active")`
- **Catalog** (`app/properti/page.tsx`): Already filters `eq(status, "active")`
- **Map** (`app/peta/page.tsx`): Already filters `eq(status, "active")`
- **Admin API** (`GET /api/properties`): Dynamic WHERE handles `?status=archived` automatically. However, add `archived` exclusion to public APIs if any return all statuses.
- **PropertyFilter** component: No change — public filters don't expose status.

## Migration

```sql
ALTER TYPE status ADD VALUE 'archived';
```

Drizzle Kit may not generate this correctly for enum types. If needed, run the SQL directly against the Neon database.

## Verification

1. `pnpm lint` — ESLint passes
2. `pnpm exec tsc --noEmit` — TypeScript type check passes
3. `pnpm test` — Jest tests pass
4. `pnpm build` — Production build succeeds
5. Manual: Create a property → edit to archived → verify it doesn't appear on homepage/catalog → verify it appears in admin with "Diarsipkan" filter
