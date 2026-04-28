import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { favorites, properties, propertyImages } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ favorites: [] })

  const userFavorites = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, session.user.id))

  const propertyList = await Promise.all(
    userFavorites.map(async (fav) => {
      const [property] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, fav.propertyId!))
        .limit(1)
      if (!property) return null
      const images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, property.id))
        .orderBy(propertyImages.order)
      return { ...property, images }
    })
  )

  return NextResponse.json({ favorites: propertyList.filter(Boolean) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { propertyId } = await req.json()

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, session.user.id), eq(favorites.propertyId, propertyId)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.propertyId, propertyId)))
    return NextResponse.json({ favorited: false })
  }

  await db.insert(favorites).values({ userId: session.user.id, propertyId })
  return NextResponse.json({ favorited: true })
}
