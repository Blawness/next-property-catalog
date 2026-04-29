# AGENTS.md — next-property-catalog

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npm run test         # Jest (jsdom env, setup via jest.setup.js)
npm run test:watch   # Jest watch mode
npm run seed         # seed database via db/seed.ts (requires DATABASE_URL)
```

Order for verification: `lint -> typecheck (tsc --noEmit) -> test -> build`.

## Architecture

**PropIndo** — Indonesian property listing platform (rumah, apartemen, tanah, ruko).

### Stack
- **Next.js 16.2.4** (App Router) + **React 19** — read `node_modules/next/dist/docs/` before writing code; breaking changes from training data
- **Drizzle ORM** + **Neon** (serverless PostgreSQL) — client at `db/index.ts`, schema at `db/schema.ts`
- **NextAuth v4** (Credentials provider with bcrypt) — config at `lib/auth.ts`, handler at `app/api/auth/[...nextauth]/route.ts`
- **UploadThing** — image uploads via `lib/uploadthing.ts` + `app/api/uploadthing/route.ts`
- **Tailwind CSS v4** + **shadcn/ui** (radix-nova style) — components in `components/ui/`
- **Leaflet / react-leaflet** — map views (`components/PropertyMap.tsx`, `components/LeafletMapView.tsx`)

### Database (`db/schema.ts`)
4 tables: `profiles`, `properties`, `property_images`, `favorites`.

Enums: `role` (buyer|agent), `property_type` (rumah|apartemen|tanah|ruko), `listing_type` (jual|sewa), `status` (active|sold|rented).

Migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`. Config at `drizzle.config.ts` reads `.env.local`.

### Routes
| Path | Purpose |
|------|---------|
| `/` | Homepage — featured active listings |
| `/properti` | Catalog with filters |
| `/properti/[id]` | Property detail |
| `/peta` | Map view of all listings |
| `/masuk` | Sign in |
| `/daftar` | Sign up |
| `/profil` | User profile |
| `/pasang-iklan` | Post listing (auth required) |
| `POST /api/properties` | Create property + images (session-guarded) |
| `GET\|POST /api/favorites` | Favorites CRUD |
| `/api/auth/[...nextauth]` | NextAuth handler |
| `/api/auth/register` | Registration endpoint |
| `/api/uploadthing` | UploadThing handler |

### Path Alias
`@/` maps to project root (see `tsconfig.json`).

## Key Conventions & Gotchas

- **Rate limiter is in-memory** (`lib/rate-limit.ts`) — resets on process restart, not shared across instances. Used for login protection (5 attempts / 15 min).
- **`PropertyWithImages`** (`lib/types.ts`) is the primary data shape — use `getPropertiesWithImagesBatch()` (`lib/db-helpers.ts`) to avoid N+1 queries.
- **Decimal fields** (`price`, `lat`, `lng`) are stored as strings in TypeScript types — convert with `parseFloat()` or `Number()` before math.
- **shadcn/ui** uses `radix-nova` style with CSS variables (see `components.json`). Add components via `npx shadcn add <component>`.
- **`.env.local` is gitignored** — never commit secrets. Required vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `UPLOADTHING_TOKEN`.
- **Image domains** allowed: `images.unsplash.com`, `*.ufsedge.com`, `*.uploadthing.com` (see `next.config.ts`).
