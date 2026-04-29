import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

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
  landArea: z.string().optional(),
  buildingArea: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
