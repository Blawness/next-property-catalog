import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import HowWeWork from "@/components/HowWeWork"
import PopularCities from "@/components/PopularCities"
import ContactSection from "@/components/ContactSection"
import type { PropertyWithImages } from "@/lib/types"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"

export const revalidate = 60

async function getFeaturedProperties(): Promise<PropertyWithImages[]> {
  return getPropertiesWithImagesBatch(
    db
      .select()
      .from(properties)
      .where(and(eq(properties.status, "active"), isNull(properties.deletedAt)))
      .orderBy(desc(properties.createdAt))
      .limit(6),
  )
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <HowWeWork />

      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <PopularCities />
      <ContactSection />
    </div>
  )
}
