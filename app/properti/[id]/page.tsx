import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/db"
import { properties, propertyImages, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin } from "lucide-react"
import PropertyMap from "@/components/PropertyMap"
import PropertyGallery from "@/components/PropertyGallery"
import PropertySpecs from "@/components/PropertySpecs"
import AgentCard from "@/components/AgentCard"
import { formatPriceFull, PROPERTY_TYPE_LABELS } from "@/lib/constants"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1)

  if (!property) return null

  const [images, agent] = await Promise.all([
    db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id))
      .orderBy(propertyImages.order),
    property.agentId
      ? db
          .select()
          .from(profiles)
          .where(eq(profiles.id, property.agentId))
          .limit(1)
          .then((r) => r[0])
      : null,
  ])

  return { property, images, agent }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getProperty(id)

  if (!data) return { title: "Properti Tidak Ditemukan — PropIndo" }

  const { property, images } = data
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0]
  const formattedPrice = formatPriceFull(property.price, property.listingType)

  const description = property.description
    ? property.description.slice(0, 160)
    : `${property.title} di ${property.city} — ${formattedPrice}`

  return {
    title: `${property.title} — ${formattedPrice} | PropIndo`,
    description,
    openGraph: {
      title: property.title,
      description,
      type: "article",
      images: primaryImage ? [{ url: primaryImage.url, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getProperty(id)

  if (!data) notFound()

  const { property, images, agent } = data
  const formattedPrice = formatPriceFull(property.price, property.listingType)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <PropertyGallery images={images} title={property.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant={property.listingType === "jual" ? "default" : "secondary"}>
                {property.listingType === "jual" ? "Dijual" : "Disewa"}
              </Badge>
              <Badge variant="outline">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
              {property.status !== "active" && (
                <Badge variant="destructive">
                  {property.status === "sold" ? "Terjual" : "Tersewa"}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {formattedPrice}
              {property.listingType === "sewa" && (
                <span className="text-base font-normal text-muted-foreground">/bulan</span>
              )}
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {property.address ? `${property.address}, ` : ""}
                {property.city}
              </span>
            </div>
          </div>

          <Separator />

          <PropertySpecs
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            buildingArea={property.buildingArea}
            landArea={property.landArea}
          />

          {property.description && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-2">Deskripsi</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </div>
            </>
          )}

          {property.lat && property.lng && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-3">Lokasi</h2>
                <PropertyMap
                  lat={parseFloat(property.lat)}
                  lng={parseFloat(property.lng)}
                  title={property.title}
                />
              </div>
            </>
          )}
        </div>

        <AgentCard agent={agent} createdAt={property.createdAt} />
      </div>
    </div>
  )
}
