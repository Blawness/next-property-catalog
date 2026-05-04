# Codebase Improvements — Frontend & Backend

**Date:** 2026-05-04
**Status:** Draft

## Overview

10 improvement proposals (5 frontend, 5 backend) hasil analisis menyeluruh codebase next-property-catalog. Fokus pada reliability, performance, accessibility, dan security tanpa mengubah fitur existing.

---

## Frontend Improvements

### F1. Loading, Error, Empty State yang Konsisten

**Masalah:**
- Semua admin page (`/admin`, `/admin/agent`, `/admin/properti`) pakai `.catch(() => {})` — API error ditelan tanpa user feedback
- `AdminLayoutClient.tsx:84` return `null` saat loading — bikin flash putih
- `hooks/useFavorites.ts:20` silently return `[]` on API error

**Usul:**
- Ganti `.catch(() => {})` jadi `.catch((err) => { setError(err.message); setLoading(false) })` + render error state UI
- Admin layout return Skeleton/spinner saat loading, bukan `null`
- `useFavorites` expose `error` state + render UI feedback

**Files:** `app/admin/page.tsx`, `app/admin/agent/page.tsx`, `app/admin/properti/page.tsx`, `app/admin/AdminLayoutClient.tsx`, `hooks/useFavorites.ts`

---

### F2. Mobile Filter Drawer untuk Katalog

**Masalah:** Sidebar filter di `/properti` hidden di bawah `lg` (`hidden lg:block`). User mobile tidak bisa filter sama sekali.

**Usul:** Tambah `<Sheet>` dari shadcn/ui (sudah terinstall) sebagai filter drawer mobile. Trigger button muncul di bawah `lg`, drawer berisi komponen `<PropertyFilter>` yang sama.

**Files:** `app/properti/page.tsx`

---

### F3. Admin Filter State via URL

**Masalah:** Admin property list (`/admin/properti`) simpan filter state (search, status, type, page) di local state. Navigasi balik = semua filter hilang. Public catalog sudah pakai `searchParams` URL.

**Usul:** Sync admin filter state dengan URL search params (pakai `useSearchParams` + `useRouter`) — filter persistent across navigation + bisa di-share via URL.

**Files:** `app/admin/properti/page.tsx`

---

### F4. Lightbox Keyboard + Accessibility

**Masalah:** Lightbox di `PropertyGalleryClient` tidak ada:
- Keyboard support (no Escape, no ArrowLeft/Right)
- `role="dialog"`, `aria-modal`, `aria-label`
- Focus trap dalam lightbox
- Focus restoration setelah close

**Usul:** Tambah `onKeyDown` handler (Escape close, ArrowLeft/Right prev/next), ARIA attributes, focus trap, dan restore focus.

**Files:** `components/PropertyGalleryClient.tsx`

---

### F5. Bersihin Kode Mati (Dead Code Cleanup)

**Masalah:** File-file tidak pernah diimport/dipakai:
- `components/PropertyGallery.tsx` — duplicate server version, semua pakai `PropertyGalleryClient`
- `components/EmptyState.tsx` — generic component not used anywhere
- `components/SearchBar.tsx` — overlap dengan `HeroSearchForm`
- `lib/auth-client.ts` — cuma re-export 3 fungsi dari `next-auth/react`

**Usul:** Hapus 4 file unused. Kurangi bundle size dan technical debt.

**Files:** `components/PropertyGallery.tsx`, `components/EmptyState.tsx`, `components/SearchBar.tsx`, `lib/auth-client.ts`

---

## Backend Improvements

### B1. Fix `propertiesThisMonth` Stats

**File:** `app/api/admin/stats/route.ts:29-33`

**Masalah:** Query `monthResult` filter cuma `status = "active"`, tidak ada `WHERE created_at >= awal_bulan`. Hasilnya **sama persis** dengan `activeResult`. Dashboard stat "properti bulan ini" selalu salah.

**Usul:** Tambah date condition:
```typescript
gte(properties.createdAt, new Date(new Date().getFullYear(), new Date().getMonth(), 1))
```

---

### B2. Fix N+1 Agent Property Counts

**File:** `app/api/admin/agents/route.ts:37-45`

**Masalah:** `Promise.all(agents.map(... => db.select().from(properties)...))` — untuk N agent, bikin N+1 query ke DB. Dengan 50 agent = 51 roundtrip.

**Usul:** Satu query pakai `GROUP BY`:
```typescript
const counts = await db
  .select({ agentId: properties.agentId, count: count() })
  .from(properties)
  .where(inArray(properties.agentId, agentIds))
  .groupBy(properties.agentId)
```
Lalu map ke agents by `agentId`.

---

### B3. Rate Limiting untuk Mutation Endpoint

**Masalah:** Hanya login yang di-rate-limit. Semua POST/PATCH/DELETE endpoint tidak ada rate limit:
- `POST/PATCH/DELETE /api/properties`
- `POST/PATCH/DELETE /api/admin/agents`
- `PATCH /api/profil`
- `POST /api/favorites`

**Usul:** Tambah rate limiting ringan (30 req/min per IP) ke semua mutation endpoint. Rate limiter `lib/rate-limit.ts` sudah tersedia, tinggal dipanggil di middleware setiap route.

**Files:** `app/api/properties/route.ts`, `app/api/properties/[id]/route.ts`, `app/api/admin/agents/route.ts`, `app/api/admin/agents/[id]/route.ts`, `app/api/profil/route.ts`, `app/api/favorites/route.ts`

---

### B4. Validasi Numeric Field di API

**File:** `app/api/properties/route.ts:19-22` + `app/api/properties/[id]/route.ts:44-49`

**Masalah:** `landArea`, `buildingArea`, `bedrooms`, `bathrooms` divalidasi sebagai `z.string().optional()` saja. Tidak dicek apakah bisa di-parse jadi positive integer. `parseInt("abc", 10)` menghasilkan `NaN` → disimpan sebagai `null` tanpa error.

**Usul:** Ganti ke:
```typescript
z.coerce.number().int().positive().optional()
```
Atau tambah `.refine((v) => !v || !isNaN(parseInt(v, 10)), "Harus angka")` di skema zod yang ada.

---

### B5. Caching untuk Public Pages

**Masalah:** Semua public-facing query (homepage, catalog, detail, peta) dijalankan fresh tiap request. Tidak ada `revalidate`, `cache()`, atau stale-while-revalidate. Beban DB tinggi, latency bertambah.

**Usul:**
- Homepage: `export const revalidate = 60`
- Catalog listing: `export const revalidate = 60`
- Property detail: `export const revalidate = 30`
- Peta (map): `export const revalidate = 120`

Atau pakai React `cache()` untuk deduplicate query dalam 1 request cycle.

**Files:** `app/page.tsx`, `app/properti/page.tsx`, `app/properti/[id]/page.tsx`, `app/peta/page.tsx`

---

## Priority Order

| # | Prio | Area | Impact |
|---|------|------|--------|
| B1 | High | Backend | Statistik dashboard salah — data integrity |
| B2 | High | Backend | N+1 query — performance bottleneck |
| B3 | Medium | Backend | Security — defense against abuse |
| F1 | Medium | Frontend | UX — user tidak tahu kalau ada error |
| B4 | Medium | Backend | Data quality — bad input silently accepted |
| F2 | Medium | Frontend | UX — mobile users can't filter at all |
| B5 | Medium | Backend | Performance — unnecessary DB load |
| F3 | Low | Frontend | UX — admin filter state lost on navigation |
| F4 | Low | Frontend | Accessibility — keyboard users excluded |
| F5 | Low | Frontend | Maintenance — dead code cleanup |
