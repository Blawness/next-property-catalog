import Link from "next/link"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import PropertyCard from "@/components/PropertyCard"
import SearchBar from "@/components/SearchBar"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"
import type { PropertyWithImages } from "@/lib/types"

async function getFeaturedProperties(): Promise<PropertyWithImages[]> {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "active"))
    .orderBy(desc(properties.createdAt))
    .limit(6)

  return Promise.all(
    rows.map(async (prop) => {
      const images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, prop.id))
        .orderBy(propertyImages.order)
      return { ...prop, images }
    })
  )
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <div>
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Temukan Properti Impianmu
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Ribuan listing rumah, apartemen, tanah, dan ruko di seluruh Indonesia
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/peta">
              <Map className="h-4 w-4 mr-2" />
              Lihat di Peta
            </Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Properti Terbaru</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/properti">Lihat Semua →</Link>
          </Button>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>Belum ada listing properti.</p>
            <Button className="mt-4" asChild>
              <Link href="/pasang-iklan">Pasang Iklan Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
