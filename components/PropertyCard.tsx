import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react"
import type { PropertyWithImages } from "@/lib/types"

function formatPrice(price: string, listingType: string) {
  const num = parseInt(price)
  const formatted =
    num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)} M`
      : num >= 1_000_000
        ? `${(num / 1_000_000).toFixed(0)} Jt`
        : `${num.toLocaleString("id-ID")}`
  return `Rp ${formatted}${listingType === "sewa" ? "/bln" : ""}`
}

const typeLabel: Record<string, string> = {
  rumah: "Rumah",
  apartemen: "Apartemen",
  tanah: "Tanah",
  ruko: "Ruko",
}

export default function PropertyCard({ property }: { property: PropertyWithImages }) {
  const primaryImage = property.images.find((img) => img.isPrimary) ?? property.images[0]

  return (
    <Link href={`/properti/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative h-48 bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Tidak ada foto
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant={property.listingType === "jual" ? "default" : "secondary"}>
              {property.listingType === "jual" ? "Dijual" : "Disewa"}
            </Badge>
            <Badge variant="outline" className="bg-background/80">
              {typeLabel[property.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold text-lg text-primary">
            {formatPrice(property.price, property.listingType)}
          </p>
          <h3 className="font-medium line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{property.city}</span>
          </div>
          {property.type !== "tanah" && (
            <div className="flex gap-3 text-sm text-muted-foreground pt-1 border-t">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  {property.bedrooms} KT
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  {property.bathrooms} KM
                </span>
              )}
              {property.buildingArea != null && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5" />
                  {property.buildingArea} m²
                </span>
              )}
            </div>
          )}
          {property.type === "tanah" && property.landArea != null && (
            <div className="flex gap-3 text-sm text-muted-foreground pt-1 border-t">
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.landArea} m²
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
