import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { eq } from "drizzle-orm"
import MapView from "@/components/MapView"

async function getPropertiesWithCoords() {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "active"))

  const withCoords = rows.filter((p) => p.lat && p.lng)

  return Promise.all(
    withCoords.map(async (prop) => {
      const images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, prop.id))
        .limit(1)
      return { ...prop, images }
    })
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
