import { db } from "@/db"
import { properties } from "@/db/schema"
import { eq, desc, and, gte, lte, ilike, isNull } from "drizzle-orm"
import PropertyCard from "@/components/PropertyCard"
import PropertyFilter from "@/components/PropertyFilter"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Suspense } from "react"
import Link from "next/link"
import type { PropertyWithImages } from "@/lib/types"
import { getPropertiesWithImagesBatch } from "@/lib/db-helpers"
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants"
import { SlidersHorizontal, SearchX } from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{
    type?: string
    listingType?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    minBedrooms?: string
  }>
}

async function getProperties(filters: Awaited<PageProps["searchParams"]>): Promise<PropertyWithImages[]> {
  const conditions = [eq(properties.status, "active"), isNull(properties.deletedAt)]

  if (filters.type && PROPERTY_TYPES.includes(filters.type as typeof PROPERTY_TYPES[number])) {
    conditions.push(eq(properties.type, filters.type as typeof PROPERTY_TYPES[number]))
  }
  if (filters.listingType && LISTING_TYPES.includes(filters.listingType as typeof LISTING_TYPES[number])) {
    conditions.push(eq(properties.listingType, filters.listingType as typeof LISTING_TYPES[number]))
  }
  if (filters.city) {
    conditions.push(ilike(properties.city, `%${filters.city}%`))
  }
  if (filters.minPrice) {
    conditions.push(gte(properties.price, filters.minPrice))
  }
  if (filters.maxPrice) {
    conditions.push(lte(properties.price, filters.maxPrice))
  }

  return getPropertiesWithImagesBatch(
    db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt))
      .limit(48),
  )
}

const SKELETON_CARDS = Array.from({ length: 6 })

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {SKELETON_CARDS.map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

async function PropertyGrid({ filters }: { filters: Awaited<PageProps["searchParams"]> }) {
  const items = await getProperties(filters)

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
          <SearchX size={28} strokeWidth={1.5} />
        </div>
        <p className="mt-4 font-sans text-lg font-semibold text-foreground">
          Tidak ada properti ditemukan
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Coba ubah atau hapus beberapa filter.
        </p>
        <Button variant="outline" size="sm" className="mt-5 rounded-xl" asChild>
          <Link href="/properti">Reset Filter</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Menampilkan <span className="font-semibold italic text-primary">{items.length}</span> properti
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((property, i) => (
          <Reveal key={property.id} delay={(i % 3) * 90}>
            <PropertyCard property={property} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default async function PropertiPage({ searchParams }: PageProps) {
  const filters = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeading eyebrow="Katalog" title="Katalog Properti" />

      {/* Mobile filter drawer */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl">
              <SlidersHorizontal size={14} className="mr-1" /> Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter Properti</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Suspense>
                <PropertyFilter />
              </Suspense>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 rounded-3xl bg-secondary/60 p-6">
            <Suspense>
              <PropertyFilter />
            </Suspense>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<PropertyGridSkeleton />}>
            <PropertyGrid filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
