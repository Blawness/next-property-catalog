import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, inArray, and, isNull } from "drizzle-orm"
import SectionHeading from "@/components/SectionHeading"
import MapView from "@/components/MapView"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"

export const revalidate = 120

async function getPropertiesWithCoords() {
  const rows = await db
    .select()
    .from(properties)
    .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))

  const withCoords = rows.filter((p) => p.lat && p.lng)

  if (withCoords.length === 0) return []

  return getPropertiesWithImagesBatch(
    db.select().from(properties).where(inArray(properties.id, withCoords.map((p) => p.id))),
  )
}

export default async function PetaPage() {
  const items = await getPropertiesWithCoords()

  return (
    <div className="container mx-auto px-4 py-10">
      <SectionHeading eyebrow="Peta" title="Peta Properti" subtitle="Jelajahi listing berdasarkan lokasi geografis" />
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="h-[calc(100vh-280px)] min-h-[480px]">
          <MapView properties={items} />
        </div>
      </div>
    </div>
  )
}
