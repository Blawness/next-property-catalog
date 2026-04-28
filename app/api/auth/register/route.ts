import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1)

  if (existing.length > 0) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(profiles).values({
    fullName: name,
    email,
    passwordHash,
    role: role === "agent" ? "agent" : "buyer",
  })

  return NextResponse.json({ ok: true })
}
