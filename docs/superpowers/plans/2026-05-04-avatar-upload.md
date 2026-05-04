# Avatar Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add single avatar upload to user profile page (`/profil`) and admin agent management (`/admin/agent`).

**Architecture:** Add `avatar_url` column to `profiles` table, new `profileImage` route in UploadThing, new `PATCH /api/profil` endpoint, modify agent CRUD APIs to include `avatarUrl`, propagate avatar to JWT session, and update UI in profile page, agent page, and navbar.

**Tech Stack:** Next.js 16, Drizzle ORM (Neon PostgreSQL), UploadThing, NextAuth v4 (JWT), shadcn/ui (radix-nova), Tailwind CSS v4

---

### Task 1: Database Schema — Add `avatar_url` to `profiles`

**Files:**
- Modify: `db/schema.ts:22-30`

- [ ] **Step 1: Add `avatar_url` column**

Add `avatar_url` as a nullable text column to the `profiles` table:

```typescript
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: roleEnum("role").default("buyer"),
  createdAt: timestamp("created_at").defaultNow(),
})
```

- [ ] **Step 2: Generate & run migration**

```bash
pnpm exec drizzle-kit generate && pnpm exec drizzle-kit migrate
```

Expected: Migration files created in `./drizzle/`, column added to database.

- [ ] **Step 3: Commit**

```bash
git add db/schema.ts drizzle/
git commit -m "feat: add avatar_url column to profiles table"
```

---

### Task 2: UploadThing — Add `profileImage` route

**Files:**
- Modify: `lib/uploadthing.ts`

- [ ] **Step 1: Add `profileImage` route**

Add a new route that accepts a single profile image (max 2MB), requires auth:

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  propertyImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  profileImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/uploadthing.ts
git commit -m "feat: add profileImage uploadthing route"
```

---

### Task 3: Auth — Add `image` to JWT & Session

**Files:**
- Modify: `lib/auth.ts`

- [ ] **Step 1: Add `image` to JWT interface, callbacks, and user return**

```typescript
import { NextAuthOptions, DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      role?: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    image?: string
  }
}
```

In the `authorize` function return, add `image: user.avatarUrl ?? null`:

```typescript
return { id: user.id, name: user.fullName, email: user.email, role: user.role ?? "buyer", image: user.avatarUrl ?? null }
```

In the JWT callback, add `token.image = user.image`:

```typescript
jwt({ token, user }) {
  if (user) {
    token.id = user.id
    token.role = user.role
    token.image = user.image as string | undefined
  }
  return token
},
```

In the session callback, add `session.user.image = token.image`:

```typescript
session({ session, token }) {
  if (token.id) session.user.id = token.id as string
  if (token.role) session.user.role = token.role as string
  if (token.image) session.user.image = token.image as string
  return session
},
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: propagate avatar_url to JWT session image"
```

---

### Task 4: API — Create `PATCH /api/profil` endpoint

**Files:**
- Create: `app/api/profil/route.ts`

- [ ] **Step 1: Create the endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { z } from "zod"

const updateProfileSchema = z.object({
  avatarUrl: z.string().url(),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { avatarUrl } = parsed.data

    await db
      .update(profiles)
      .set({ avatarUrl })
      .where(eq(profiles.id, session.user.id!))

    return NextResponse.json({ ok: true, avatarUrl })
  } catch (error) {
    console.error("[PATCH /api/profil]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/profil/route.ts
git commit -m "feat: add PATCH /api/profil endpoint"
```

---

### Task 5: API — Modify agent routes to include `avatarUrl`

**Files:**
- Modify: `app/api/admin/agents/route.ts`
- Modify: `app/api/admin/agents/[id]/route.ts`

- [ ] **Step 1: Update GET to select `avatarUrl`**

In `app/api/admin/agents/route.ts`, modify the select to include `avatarUrl`:

```typescript
const agents = await db
  .select({
    id: profiles.id,
    fullName: profiles.fullName,
    email: profiles.email,
    phone: profiles.phone,
    avatarUrl: profiles.avatarUrl,
    createdAt: profiles.createdAt,
  })
  .from(profiles)
  .where(eq(profiles.role, "agent"))
  .orderBy(profiles.createdAt)
```

- [ ] **Step 2: Update POST to accept `avatarUrl`**

In the same file, modify `createAgentSchema`:

```typescript
const createAgentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})
```

And in the insert, add `avatarUrl`:

```typescript
const { name, email, phone, avatarUrl } = parsed.data

// ... duplicate check ...

const [agent] = await db
  .insert(profiles)
  .values({
    fullName: name,
    email,
    passwordHash,
    phone: phone || null,
    avatarUrl: avatarUrl || null,
    role: "agent",
  })
  .returning()
```

- [ ] **Step 3: Update PATCH to accept `avatarUrl`**

In `app/api/admin/agents/[id]/route.ts`, modify `updateAgentSchema`:

```typescript
const updateAgentSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
})
```

And in the PATCH handler, update the set data:

```typescript
const updateData: Record<string, string | null> = {}
if (parsed.data.name !== undefined) updateData.fullName = parsed.data.name
if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone || null
if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl
```

- [ ] **Step 4: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/agents/route.ts app/api/admin/agents/\[id\]/route.ts
git commit -m "feat: add avatarUrl to agent CRUD API"
```

---

### Task 6: UI — Profile page avatar upload

**Files:**
- Modify: `app/profil/page.tsx`

- [ ] **Step 1: Rewrite profile page with avatar upload**

Change imports, add UploadButton, AvatarImage, and PATCH call after upload:

```typescript
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import PropertyCard from "@/components/PropertyCard"
import { useFavorites } from "@/hooks/useFavorites"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfilPage() {
  const { data: session, status, update } = useSession()
  const isPending = status === "loading"
  const { favorites, loadingFavs } = useFavorites()
  const [uploading, setUploading] = useState(false)

  const saveAvatar = async (url: string) => {
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    })
    if (!res.ok) {
      toast.error("Gagal menyimpan foto profil")
      return
    }
    await update()
    toast.success("Foto profil diperbarui")
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Kamu harus masuk terlebih dahulu.</p>
        <Button asChild>
          <Link href="/masuk">Masuk Sekarang</Link>
        </Button>
      </div>
    )
  }

  const userImage = session.user.image

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-14 w-14" size="lg">
                {userImage ? (
                  <AvatarImage src={userImage} alt={session.user.name ?? ""} />
                ) : null}
                <AvatarFallback className="text-lg">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity ${
                uploading ? "opacity-100 bg-black/50" : "opacity-0 group-hover:opacity-100 bg-black/40"
              }`}>
                {uploading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <UploadButton<OurFileRouter, "profileImage">
                    endpoint="profileImage"
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={(res) => {
                      setUploading(false)
                      const url = res?.[0]?.ufsUrl
                      if (url) saveAvatar(url)
                    }}
                    onUploadError={(err) => {
                      setUploading(false)
                      toast.error(`Upload gagal: ${err.message}`)
                    }}
                    appearance={{
                      button: "h-14 w-14 rounded-full flex items-center justify-center bg-transparent hover:bg-transparent ut-ready:bg-transparent ut-uploading:bg-transparent",
                      container: "",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: <Camera size={16} className="text-white" />,
                    }}
                  />
                )}
              </div>
            </div>
            <div>
              <CardTitle>{session.user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Properti Favorit</h2>
        {loadingFavs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl">
            <p>Belum ada favorit.</p>
            <Button variant="ghost" className="mt-2" asChild>
              <Link href="/properti">Jelajahi Properti</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add app/profil/page.tsx
git commit -m "feat: add avatar upload to profile page"
```

---

### Task 7: UI — Admin agent page avatars in table & dialog

**Files:**
- Modify: `app/admin/agent/page.tsx`

- [ ] **Step 1: Update Agent interface**

```typescript
interface Agent {
  id: string
  fullName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  propertyCount: number
}
```

- [ ] **Step 2: Add imports**

```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { Camera, Upload } from "lucide-react"
```

- [ ] **Step 3: Add state for avatar in form**

Add to the state declarations after existing states:

```typescript
const [formAvatarUrl, setFormAvatarUrl] = useState("")
```

- [ ] **Step 4: Update `openCreate` and `openEdit`**

```typescript
const openCreate = () => {
  setEditId(null)
  setFormName("")
  setFormEmail("")
  setFormPhone("")
  setFormAvatarUrl("")
  setFormError("")
  setCreatedPassword("")
  setDialogOpen(true)
}

const openEdit = (agent: Agent) => {
  setEditId(agent.id)
  setFormName(agent.fullName)
  setFormEmail(agent.email)
  setFormPhone(agent.phone ?? "")
  setFormAvatarUrl(agent.avatarUrl ?? "")
  setFormError("")
  setCreatedPassword("")
  setDialogOpen(true)
}
```

- [ ] **Step 5: Update `handleSave` to include avatarUrl**

Modify the PATCH body and POST body:

PATCH:
```typescript
body: JSON.stringify({ name: formName, phone: formPhone, avatarUrl: formAvatarUrl || null }),
```

POST:
```typescript
body: JSON.stringify({ name: formName, email: formEmail, phone: formPhone, avatarUrl: formAvatarUrl || null }),
```

- [ ] **Step 6: Add avatar to table rows**

Replace the agent row content (lines 153-176) with:

```typescript
<div className="divide-y">
  {agents.map((agent) => (
    <div key={agent.id} className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          {agent.avatarUrl ? (
            <AvatarImage src={agent.avatarUrl} alt={agent.fullName} />
          ) : null}
          <AvatarFallback className="text-xs">
            {agent.fullName[0]?.toUpperCase() ?? "A"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{agent.fullName}</p>
          <p className="text-sm text-muted-foreground">{agent.email}</p>
          <p className="text-xs text-muted-foreground">
            {agent.phone ?? "No phone"} &middot; {agent.propertyCount} properti
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => openEdit(agent)}>
          <Pencil size={14} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => handleDelete(agent.id, agent.fullName)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 7: Add avatar upload field to dialog form**

Add after the phone field (before `formError`) in the dialog:

```typescript
<div className="space-y-1">
  <Label>Foto Profil (opsional)</Label>
  <div className="flex items-center gap-3">
    {formAvatarUrl ? (
      <div className="relative">
        <Avatar size="lg">
          <AvatarImage src={formAvatarUrl} alt="Preview" />
          <AvatarFallback>
            {formName[0]?.toUpperCase() ?? "A"}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => setFormAvatarUrl("")}
          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    ) : (
      <div className={`border-2 border-dashed rounded-lg text-center transition-colors hover:border-amber-300 hover:bg-amber-50/30`}>
        <div className="p-2">
          <UploadButton<OurFileRouter, "profileImage">
            endpoint="profileImage"
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.ufsUrl
              if (url) setFormAvatarUrl(url)
            }}
            onUploadError={(err) => {
              toast.error(`Upload gagal: ${err.message}`)
            }}
            appearance={{
              button: "text-xs font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors",
              container: "",
              allowedContent: "hidden",
            }}
            content={{
              button: (
                <span className="flex items-center gap-1">
                  <Upload size={12} /> Upload
                </span>
              ),
            }}
          />
        </div>
      </div>
    )}
  </div>
</div>
```

- [ ] **Step 8: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 9: Commit**

```bash
git add app/admin/agent/page.tsx
git commit -m "feat: add avatar display and upload to admin agent page"
```

---

### Task 8: UI — Navbar show avatar image

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Update inline avatar to show user image**

Replace the hardcoded avatar (lines 98-102) with:

```typescript
<div className="h-7 w-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0 overflow-hidden">
  {session.user.image ? (
    <img
      src={session.user.image}
      alt=""
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-[11px] font-bold text-amber-700">
      {session.user.name?.[0]?.toUpperCase() ?? "U"}
    </span>
  )}
</div>
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: show user avatar image in navbar"
```

---

### Task 9: Verification

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: No errors.

- [ ] **Step 2: Run typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

Expected: All tests pass.

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: Build succeeds with all routes rendered.
