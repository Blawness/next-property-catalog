import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import MapView from "@/components/MapView"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"

async function getPropertiesWithCoords() {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "active"))

  const withCoords = rows.filter((p) => p.lat && p.lng)

  if (withCoords.length === 0) return []

  return getPropertiesWithImagesBatch(
    db.select().from(properties).where(inArray(properties.id, withCoords.map((p) => p.id))),
  )
}

export default async function PetaPage() {
  const items = await getPropertiesWithCoords()

  return (
    <div className="h-[calc(100vh-56px)]">
      <MapView properties={items} />
    </div>
  )
}
