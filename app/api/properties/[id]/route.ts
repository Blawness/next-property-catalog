import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1)

    if (!property) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id))
      .orderBy(propertyImages.order)

    return NextResponse.json({ ...property, images })
  } catch (error) {
    console.error("[GET /api/properties]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

const propertyUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  type: z.enum(["rumah", "apartemen", "tanah", "ruko"]).optional(),
  listingType: z.enum(["jual", "sewa"]).optional(),
  status: z.enum(["active", "sold", "rented"]).optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  landArea: z.string().optional(),
  buildingArea: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = propertyUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { imageUrls, ...fields } = parsed.data

    const updateData: Record<string, string | number | null> = {}
    if (fields.title !== undefined) updateData.title = fields.title
    if (fields.description !== undefined) updateData.description = fields.description || null
    if (fields.price !== undefined) updateData.price = fields.price
    if (fields.type !== undefined) updateData.type = fields.type
    if (fields.listingType !== undefined) updateData.listingType = fields.listingType
    if (fields.status !== undefined) updateData.status = fields.status
    if (fields.city !== undefined) updateData.city = fields.city
    if (fields.address !== undefined) updateData.address = fields.address || null
    if (fields.lat !== undefined) updateData.lat = fields.lat || null
    if (fields.lng !== undefined) updateData.lng = fields.lng || null
    if (fields.landArea !== undefined) updateData.landArea = fields.landArea ? parseInt(fields.landArea, 10) : null
    if (fields.buildingArea !== undefined) updateData.buildingArea = fields.buildingArea ? parseInt(fields.buildingArea, 10) : null
    if (fields.bedrooms !== undefined) updateData.bedrooms = fields.bedrooms ? parseInt(fields.bedrooms, 10) : null
    if (fields.bathrooms !== undefined) updateData.bathrooms = fields.bathrooms ? parseInt(fields.bathrooms, 10) : null

    if (Object.keys(updateData).length > 0) {
      await db.update(properties).set(updateData).where(eq(properties.id, id))
    }

    if (imageUrls !== undefined) {
      await db.delete(propertyImages).where(eq(propertyImages.propertyId, id))
      if (imageUrls.length > 0) {
        await db.insert(propertyImages).values(
          imageUrls.map((url, i) => ({
            propertyId: id,
            url,
            isPrimary: i === 0,
            order: i,
          })),
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[PATCH /api/properties]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    await db.delete(properties).where(eq(properties.id, id))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[DELETE /api/properties]", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 })
  }
}
