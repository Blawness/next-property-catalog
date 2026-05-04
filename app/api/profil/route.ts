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
