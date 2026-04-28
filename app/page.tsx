import Link from "next/link"
import { db } from "@/db"
import { properties, propertyImages } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import { Button } from "@/components/ui/button"
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
      <HeroSection />

      <section className="container mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Properti Terbaru
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Listing pilihan yang baru ditambahkan
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/properti" className="text-amber-600 hover:text-amber-700 font-medium">
              Lihat Semua →
            </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
