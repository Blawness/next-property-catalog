# Decompose Large Files — Refactoring Spec

2026-05-03

## Goal

Decompose the 4 largest files in the codebase (>200 lines each) into focused
sub-components and custom hooks. No new dependencies. No behavioral changes.

## Scope

| File | Before | After | Strategy |
|------|--------|-------|----------|
| `app/pasang-iklan/page.tsx` | 265 | ~60 | Extract `usePropertyForm` hook + `PropertyFormFields` + `ImageUploadSection` |
| `app/properti/[id]/page.tsx` | 247 | ~85 | Extract `PropertyGallery` + `PropertySpecs` + `AgentCard` |
| `components/HeroSection.tsx` | 224 | ~110 | Extract `HeroSearchForm` + `HeroPropertyTypePills` + `HeroStats`; fix PROPERTY_TYPE_LINKS duplication |
| `db/seed.ts` | 322 | ~75 | Extract data arrays to `db/seed-data.ts` |
| `app/profil/page.tsx` | 94 | ~65 | Adopt `useFavorites` hook |

## New Files

### `hooks/usePropertyForm.ts` (~70 lines)

- **Server/Client:** Client (hooks can only be used in Client Components)
- **Encapsulates:** All 18 form fields via `useReducer`, `setField(key, value)`,
  `handleSubmit()`, `loading`, `error`, `router.push` on success
- **Exposes:** `{ fields, setField, handleSubmit, loading, error }`
- **Internal state shape:** all fields from current `pasang-iklan` form +
  `imageUrls` array
- **No new dependencies** — uses React built-ins only

### `hooks/useFavorites.ts` (~50 lines)

- **Server/Client:** Client
- **Encapsulates:** `useSession()` check, `useEffect` fetch of `/api/favorites`
- **Exposes:** `{ favorites, loadingFavs }`
- **Replaces:** Inline fetch + state in `app/profil/page.tsx`

### `components/PropertyFormFields.tsx` (~110 lines)

- **Server/Client:** Client
- **Props:** `{ fields, setField, type }`
- **Content:** The form grid — title, type (Select), listingType (Select), price,
  city, address, landArea, buildingArea, bedrooms (hidden for tanah),
  bathrooms (hidden for tanah), lat, lng, description textarea
- **Extracted from:** `app/pasang-iklan/page.tsx`

### `components/ImageUploadSection.tsx` (~25 lines)

- **Server/Client:** Client
- **Props:** `{ imageUrls, setImageUrls, onError }`
- **Content:** UploadThing button + uploaded count display
- **Extracted from:** `app/pasang-iklan/page.tsx`

### `components/PropertyGallery.tsx` (~35 lines)

- **Server/Client:** Server (uses `next/image`)
- **Props:** `{ images: PropertyImage[], title: string }`
- **Content:** 3-col grid — primary image spans 2 cols, 2 thumbnails stacked
  in right column. Handles empty state (no-image fallback).
- **Extracted from:** `app/properti/[id]/page.tsx`

### `components/PropertySpecs.tsx` (~40 lines)

- **Server/Client:** Server
- **Props:** `{ property: { bedrooms, bathrooms, buildingArea, landArea } }`
- **Content:** Conditional 4-column specs grid — each spec shown only when the
  value is non-null
- **Extracted from:** `app/properti/[id]/page.tsx`

### `components/AgentCard.tsx` (~50 lines)

- **Server/Client:** Server
- **Props:** `{ agent: { fullName, phone } | null, createdAt: Date | null }`
- **Content:** Sticky sidebar — agent name, phone, WhatsApp button
  (WhatsApp URL generated from phone), posted date. Handles null agent.
- **Extracted from:** `app/properti/[id]/page.tsx`

### `components/HeroSearchForm.tsx` (~45 lines)

- **Server/Client:** Client (uses `useRouter`)
- **Props:** None (self-contained state)
- **Content:** City input + type select + submit button, pushes to
  `/properti?city=X&type=Y`
- **Extracted from:** `components/HeroSection.tsx`

### `components/HeroPropertyTypePills.tsx` (~25 lines)

- **Server/Client:** Server (uses `next/link` only, no hooks)
- **Props:** None
- **Content:** Property type pills — consumes `PROPERTY_TYPES` +
  `PROPERTY_TYPE_LABELS` from `lib/constants` instead of the hardcoded
  `PROPERTY_TYPE_LINKS` array
- **Fix:** Eliminates duplicated `PROPERTY_TYPE_LINKS` in HeroSection
- **Extracted from:** `components/HeroSection.tsx`

### `components/HeroStats.tsx` (~25 lines)

- **Server/Client:** Server
- **Props:** None
- **Content:** Stats display — "15.000+ Properti Aktif", "34 Provinsi",
  "500+ Agen Terpercaya"
- **Extracted from:** `components/HeroSection.tsx`

### `db/seed-data.ts` (~250 lines)

- **Exports:** `agents`, `cities`, `propertyData`, `photoIdByProperty`
- **Extracted from:** `db/seed.ts` — no logic, pure data

## Modified Files

### `app/pasang-iklan/page.tsx` (265 → ~60)

- Import and use `usePropertyForm` hook
- Render: auth gate → Card wrapper → `PropertyFormFields` + `ImageUploadSection` + submit button
- Removes: all `useState` fields, `setField` helper, `handleSubmit`, inline form JSX

### `app/properti/[id]/page.tsx` (247 → ~85)

- `getProperty()` stays (data fetching)
- `generateMetadata()` stays
- Page component renders: gallery → info section (badges, title, price, location) →
  specs → description → map → agent card
- Inlines only the info section; delegates gallery, specs, agent card to components

### `components/HeroSection.tsx` (224 → ~110)

- Retains: parallax scroll effect, background image, gradient overlays,
  decorative elements, scroll cue, SVG wave transition, page layout
- Removes: inline search form, property type pills, stats bar
- Composes: `HeroSearchForm`, `HeroPropertyTypePills`, `HeroStats`
- Removes: hardcoded `PROPERTY_TYPE_LINKS` constant

### `db/seed.ts` (322 → ~75)

- Import data from `db/seed-data.ts`
- Seed logic unchanged — cleanup, insert, assign IDs, insert images

### `app/profil/page.tsx` (94 → ~65)

- Import and use `useFavorites` hook
- Removes: `useState(favorites)`, `useState(loadingFavs)`, `useEffect` fetch

## What Does NOT Change

- No API routes modified
- No database schema changes
- No new npm dependencies
- No test changes needed (only `PropertyCard.test.tsx` exists, not affected)
- No visual/UX changes — all components render identically
- No auth flow changes
- No metadata changes

## Verification

```bash
pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build
```
