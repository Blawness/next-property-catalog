# CMS Dashboard — Design Spec

2026-05-03

## Goal

Restrict "pasang iklan" to admin-only CMS with a sidebar dashboard. Remove public listing creation.

## Database

- Migration: add `admin` to `roleEnum` → `["buyer", "agent", "admin"]`

## Auth (`lib/auth.ts`)

- `authorize()`: return `role: user.role`
- `jwt()`: store `token.role`
- `session()`: expose `session.user.role`
- Augment NextAuth types

## Registration (`/api/auth/register`)

- Remove `role` field from Zod schema
- All registrations default to `"buyer"`

## Admin Guard

- `app/admin/layout.tsx`: if `session.user.role !== "admin"` redirect to `/masuk`

## API Endpoints

| Endpoint | Method | Purpose | Guard |
|----------|--------|---------|-------|
| `/api/properties` | POST | Create property (modified: add admin check) | Admin |
| `/api/properties` | GET | List all properties with filters & pagination | Admin |
| `/api/properties/[id]` | PATCH | Update property fields + images | Admin |
| `/api/properties/[id]` | DELETE | Delete property + cascade images | Admin |
| `/api/admin/stats` | GET | Dashboard stats | Admin |
| `/api/admin/agents` | GET | List agents with property count | Admin |
| `/api/admin/agents` | POST | Create new agent account | Admin |
| `/api/admin/agents/[id]` | PATCH | Update agent (name, phone) | Admin |
| `/api/admin/agents/[id]` | DELETE | Delete agent, reassign properties | Admin |

## New Routes (`app/admin/`)

```
admin/
├── layout.tsx          # Sidebar shell + role guard
├── page.tsx            # Stats dashboard
├── properti/
│   ├── page.tsx        # Property list table (filters, pagination)
│   ├── create/page.tsx # Create property form
│   └── [id]/edit/page.tsx # Edit property form
└── agent/
    └── page.tsx        # Agent management
```

## Modified Files

| File | Change |
|------|--------|
| `db/schema.ts` | Add `admin` to role enum |
| `lib/auth.ts` | Propagate role to session |
| `app/api/properties/route.ts` | Add admin check to POST; add GET handler |
| `app/api/auth/register/route.ts` | Remove agent option |
| `components/Navbar.tsx` | Admin sees "Dashboard" link to `/admin` instead of "Pasang Iklan" |
| `app/page.tsx` | Remove "Pasang Iklan Pertama" CTA from empty state |
| `app/daftar/page.tsx` | Remove agent role option |
| `hooks/usePropertyForm.ts` | Redirect to `/admin/properti` after create |

## Removed Files

| File | Reason |
|------|--------|
| `app/pasang-iklan/` | Moved to `/admin/properti/create` |

## Reused Components

- `PropertyFormFields.tsx` — create & edit forms
- `ImageUploadSection.tsx` — image upload in create & edit
- `usePropertyForm.ts` — form state management (redirect modified)

## No Changes

- Public catalog, map, profile pages
- Auth handler, favorites API, uploadthing
- All existing UI components
