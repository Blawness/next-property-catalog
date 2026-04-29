import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { db } from "@/db"
import { properties, propertyImages, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MapPin, BedDouble, Bath, Maximize2, Phone, Calendar } from "lucide-react"
import PropertyMap from "@/components/PropertyMap"
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

  const primaryImage = images.find((img) => img.isPrimary) ?? images[0]
  const otherImages = images.filter((img) => img.id !== primaryImage?.id)

  const formattedPrice = formatPriceFull(property.price, property.listingType)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Gallery */}
      <div className="grid grid-cols-3 gap-2 h-72 sm:h-96 mb-6 rounded-xl overflow-hidden">
        <div className="col-span-2 relative bg-muted">
          {primaryImage ? (
            <Image src={primaryImage.url} alt={property.title} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Tidak ada foto
            </div>
          )}
        </div>
        <div className="grid grid-rows-2 gap-2">
          {otherImages.slice(0, 2).map((img) => (
            <div key={img.id} className="relative bg-muted">
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
          {otherImages.length < 2 && (
            <div className="bg-muted rounded" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
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
              <span>{property.address ? `${property.address}, ` : ""}{property.city}</span>
            </div>
          </div>

          <Separator />

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {property.bedrooms != null && (
              <div className="text-center p-3 border rounded-lg">
                <BedDouble className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{property.bedrooms}</p>
                <p className="text-xs text-muted-foreground">Kamar Tidur</p>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="text-center p-3 border rounded-lg">
                <Bath className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{property.bathrooms}</p>
                <p className="text-xs text-muted-foreground">Kamar Mandi</p>
              </div>
            )}
            {property.buildingArea != null && (
              <div className="text-center p-3 border rounded-lg">
                <Maximize2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{property.buildingArea} m²</p>
                <p className="text-xs text-muted-foreground">Luas Bangunan</p>
              </div>
            )}
            {property.landArea != null && (
              <div className="text-center p-3 border rounded-lg">
                <Maximize2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{property.landArea} m²</p>
                <p className="text-xs text-muted-foreground">Luas Tanah</p>
              </div>
            )}
          </div>

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

          {/* Map */}
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

        {/* Agent card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 border rounded-xl p-5 space-y-4 bg-card">
            <h3 className="font-semibold">Hubungi Agen</h3>
            {agent ? (
              <>
                <div>
                  <p className="font-medium">{agent.fullName}</p>
                  {agent.phone && (
                    <p className="text-sm text-muted-foreground">{agent.phone}</p>
                  )}
                </div>
                {agent.phone && (
                  <Button className="w-full" asChild>
                    <a
                      href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Info agen tidak tersedia</p>
            )}
            <Separator />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Diposting{" "}
                {property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
