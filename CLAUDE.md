# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run lint     # ESLint check
```

No test suite is configured. There is no `npm test` command.

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `UPLOADTHING_TOKEN` — UploadThing token for image uploads
- Better Auth also requires its own secrets (see `lib/auth.ts`)

## Architecture

**PropIndo** is an Indonesian property listing platform (rumah, apartemen, tanah, ruko).

### Stack
- **Next.js 16** (App Router) with React 19 — this version may have breaking changes vs. training data; read `node_modules/next/dist/docs/` first
- **Drizzle ORM** + **Neon** (serverless PostgreSQL) — DB client at `db/index.ts`, schema at `db/schema.ts`
- **Better Auth** — auth at `lib/auth.ts` (server) and `lib/auth-client.ts` (client); all auth routes handled by `app/api/auth/[...all]/route.ts`
- **UploadThing** — image upload router at `lib/uploadthing.ts`, route at `app/api/uploadthing/route.ts`
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives) — UI components in `components/ui/`
- **Leaflet / react-leaflet** — interactive map views (`components/PropertyMap.tsx`, `components/LeafletMap.tsx`, `components/MapView.tsx`)

### Database Schema (`db/schema.ts`)
Four tables: `profiles`, `properties`, `property_images`, `favorites`. Key enums:
- `property_type`: `rumah | apartemen | tanah | ruko`
- `listing_type`: `jual | sewa`
- `status`: `active | sold | rented`
- `role`: `buyer | agent`

Properties store optional `lat`/`lng` decimals for map display.

### Routes
| Path | Purpose |
|------|---------|
| `/` | Homepage — featured active listings |
| `/properti` | Browseable listing catalog with filters |
| `/properti/[id]` | Property detail |
| `/peta` | Map view of all listings |
| `/masuk` | Sign in |
| `/daftar` | Sign up |
| `/profil` | User profile |
| `/pasang-iklan` | Post a new listing (auth required) |
| `POST /api/properties` | Create property + images (session-guarded) |
| `GET|POST /api/auth/[...all]` | Better Auth handler |
| `GET|POST /api/uploadthing` | UploadThing handler |
| `GET|POST /api/favorites` | Favorites CRUD |

### Key Shared Types (`lib/types.ts`)
`PropertyWithImages` (= `Property` + `images: PropertyImage[]`) is the primary data shape passed between server components and client components.

### Path Alias
`@/` maps to the project root (configured in `tsconfig.json`).

### Drizzle Migrations
Use `drizzle-kit` for schema migrations. No migration scripts are committed yet — run `npx drizzle-kit generate` then `npx drizzle-kit migrate` when schema changes.
