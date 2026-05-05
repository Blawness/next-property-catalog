import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { eq, and, like, asc, or, count, inArray } from "drizzle-orm"
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"

const propertySchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  price: z.string().min(1, "Harga wajib diisi"),
  type: z.enum(["rumah", "apartemen", "tanah", "ruko"]),
  listingType: z.enum(["jual", "sewa"]),
  city: z.string().min(1, "Kota wajib diisi"),
  address: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  landArea: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
  buildingArea: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
  bedrooms: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
  bathrooms: z.string().refine((v) => v === "" || !isNaN(parseInt(v, 10)), "Harus angka").optional(),
  imageUrls: z.array(z.string().url()).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") ?? "1", 10)
    const limit = parseInt(searchParams.get("limit") ?? "20", 10)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const city = searchParams.get("city")
    const search = searchParams.get("search")

    const conditions = []

    if (status) conditions.push(eq(properties.status, status as "active" | "sold" | "rented"))
    if (type) conditions.push(eq(properties.type, type as "rumah" | "apartemen" | "tanah" | "ruko"))
    if (city) conditions.push(eq(properties.city, city))
    if (search) {
      conditions.push(
        or(
          like(properties.title, `%${search}%`),
          like(properties.city, `%${search}%`),
        )!
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [countResult] = await db
      .select({ count: count() })
      .from(properties)
      .where(where)

    const total = countResult?.count ?? 0

    const items = await db
      .select()
      .from(properties)
      .where(where)
      .orderBy(asc(properties.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)

    // Batch fetch primary images
    const ids = items.map((p) => p.id)
    const images =
      ids.length > 0
        ? await db
            .select()
            .from(propertyImages)
            .where(and(inArray(propertyImages.propertyId, ids), eq(propertyImages.isPrimary, true)))
        : []

    const imageMap = new Map<string, string>()
    for (const img of images) {
      if (img.propertyId) imageMap.set(img.propertyId, img.url)
    }

    return NextResponse.json({
      items: items.map((p) => ({ ...p, primaryImageUrl: imageMap.get(p.id) ?? null })),
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error("[GET /api/properties]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for") ?? "unknown"
    const limit = rateLimit(getRateLimitKey(ip, "property-create"), { windowMs: 60_000, max: 30 })
    if (!limit.success) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 })
    }

    const body = await req.json()
    const parsed = propertySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { imageUrls = [], ...fields } = parsed.data

    const [property] = await db
      .insert(properties)
      .values({
        title: fields.title,
        description: fields.description || null,
        price: fields.price,
        type: fields.type,
        listingType: fields.listingType,
        city: fields.city,
        address: fields.address || null,
        lat: fields.lat || null,
        lng: fields.lng || null,
        landArea: fields.landArea ? parseInt(fields.landArea, 10) : null,
        buildingArea: fields.buildingArea ? parseInt(fields.buildingArea, 10) : null,
        bedrooms: fields.bedrooms ? parseInt(fields.bedrooms, 10) : null,
        bathrooms: fields.bathrooms ? parseInt(fields.bathrooms, 10) : null,
        agentId: session.user.id,
      })
      .returning()

    if (imageUrls.length > 0) {
      await db.insert(propertyImages).values(
        imageUrls.map((url, i) => ({
          propertyId: property.id,
          url,
          isPrimary: i === 0,
          order: i,
        })),
      )
    }

    return NextResponse.json({ id: property.id })
  } catch (error) {
    console.error("[POST /api/properties]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
