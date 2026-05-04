# Avatar Upload — Profile & Admin Agent

**Date:** 2026-05-04
**Status:** Approved

## Overview

Menambahkan fitur upload avatar (foto profil single) untuk user di halaman `/profil` dan untuk agent di halaman `/admin/agent`.

Siapa yang bisa upload:
- **User (buyer/agent)** upload avatar sendiri di `/profil`
- **Admin** upload/set avatar agent saat create/edit di `/admin/agent`

## Design

### 1. Database

Tambah kolom `avatar_url` (TEXT, nullable) di tabel `profiles`:

```sql
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
```

Migration via drizzle: `pnpm exec drizzle-kit generate && pnpm exec drizzle-kit migrate`.

### 2. UploadThing Route

Tambah route `profileImage` di `lib/uploadthing.ts`:

- Single image, max 2MB
- Auth required (middleware checks session)
- Return `{ url: file.ufsUrl }` on complete

### 3. API Endpoints

**`PATCH /api/profil` (baru)**
- Auth required
- Request body: `{ avatarUrl: string }`
- Update `profiles.avatar_url` untuk user yang login
- Return `{ ok: true, avatarUrl: "..." }`

**`PATCH /api/admin/agents/[id]` (modifikasi)**
- Tambah field `avatarUrl: z.string().url().optional()` di zod schema
- Update `profiles.avatar_url` jika ada

**`GET /api/admin/agents` (modifikasi)**
- Tambah `avatarUrl: profiles.avatarUrl` di select query

### 4. Auth / Session

**`lib/auth.ts`** — tambah `image` ke JWT dan session:

- JWT callback: `token.image = user.avatarUrl`
- Session callback: `session.user.image = token.image`

### 5. UI — `/profil` (profile page)

- Ganti `<AvatarFallback>` jadi render `<AvatarImage>` kalau `session.user.image` ada, fallback ke inisial
- Tambah `<UploadButton<OurFileRouter, "profileImage">` di bawah/kiri avatar
- Setelah upload sukses, panggil `PATCH /api/profil` untuk simpan URL, lalu `update()` session
- Gunakan styling yang konsisten dengan `ImageUploadSection.tsx` (amber-themed)

### 6. UI — `/admin/agent` (agent management)

- **Table:** tambah kolom avatar bulat kecil (`<Avatar>`) di samping nama agent
- **Create dialog:** tambah upload avatar field (optional)
- **Edit dialog:** tambah upload avatar field (optional, tampilkan existing avatar)
- Upload via `<UploadButton<OurFileRouter, "profileImage">`
- Avatar URL dikirim sebagai bagian dari body `POST` / `PATCH`

### 7. Image Domains

`next.config.ts` sudah mengizinkan `utfs.io`, `*.ufsedge.com`, `*.uploadthing.com` — tidak perlu perubahan.

## Files Changed

| File | Action |
|------|--------|
| `db/schema.ts` | Tambah kolom `avatar_url` di `profiles` |
| `lib/uploadthing.ts` | Tambah route `profileImage` |
| `app/api/profil/route.ts` | **Baru** — PATCH endpoint untuk update avatar |
| `app/api/admin/agents/route.ts` | Modifikasi GET + POST — include avatarUrl |
| `app/api/admin/agents/[id]/route.ts` | Modifikasi PATCH — support avatarUrl field |
| `lib/auth.ts` | Tambah `image` ke JWT & session |
| `app/profil/page.tsx` | Tambah UploadButton + AvatarImage |
| `app/admin/agent/page.tsx` | Tambah avatar di table + dialog CRUD |
| `components/ui/avatar.tsx` | (optional) Pastikan AvatarImage sudah ada |

## Verification

1. `pnpm lint` — no errors
2. `pnpm exec tsc --noEmit` — typecheck passes
3. `pnpm test` — existing tests pass
4. `pnpm build` — production build succeeds
5. Manual: upload avatar di `/profil`, verifikasi muncul di navbar + profile page
6. Manual: admin set avatar agent, verifikasi tampil di table
