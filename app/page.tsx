import Link from "next/link"
import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import { ArrowRight } from "lucide-react"
import PropertyCard from "@/components/PropertyCard"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import HowWeWork from "@/components/HowWeWork"
import ExploreTypes from "@/components/ExploreTypes"
import PopularCities from "@/components/PopularCities"
import ContactSection from "@/components/ContactSection"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
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
        <SectionHeading
          align="left"
          eyebrow="Listing"
          title="Properti Pilihan"
          subtitle="Listing terbaru dari agen terpercaya di seluruh Indonesia"
        />

        <ExploreTypes />

        <div className="mt-10 flex items-center justify-between">
          <h3 className="font-sans text-lg font-semibold text-foreground sm:text-xl">
            Properti Terbaru
          </h3>
          <Link
            href="/properti"
            className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80"
          >
            Lihat Semua
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Belum ada listing properti.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal key={property.id} delay={(i % 3) * 90}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <PopularCities />

      <ContactSection />
    </div>
  )
}
