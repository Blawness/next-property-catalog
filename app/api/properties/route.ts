import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { imageUrls = [], ...fields } = body

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
      landArea: fields.landArea ? parseInt(fields.landArea) : null,
      buildingArea: fields.buildingArea ? parseInt(fields.buildingArea) : null,
      bedrooms: fields.bedrooms ? parseInt(fields.bedrooms) : null,
      bathrooms: fields.bathrooms ? parseInt(fields.bathrooms) : null,
      agentId: session.user.id,
    })
    .returning()

  if (imageUrls.length > 0) {
    await db.insert(propertyImages).values(
      imageUrls.map((url: string, i: number) => ({
        propertyId: property.id,
        url,
        isPrimary: i === 0,
        order: i,
      }))
    )
  }

  return NextResponse.json({ id: property.id })
}
