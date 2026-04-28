import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react"
import type { PropertyWithImages } from "@/lib/types"

function formatPrice(price: string, listingType: string) {
  const num = parseInt(price)
  const formatted =
    num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)} M`
      : num >= 1_000_000
        ? `${(num / 1_000_000).toFixed(0)} Jt`
        : num.toLocaleString("id-ID")
  return `Rp ${formatted}${listingType === "sewa" ? "/bln" : ""}`
}

const TYPE_LABEL: Record<string, string> = {
  rumah:     "Rumah",
  apartemen: "Apartemen",
  tanah:     "Tanah",
  ruko:      "Ruko",
}

export default function PropertyCard({ property }: { property: PropertyWithImages }) {
  const primaryImage = property.images.find(i => i.isPrimary) ?? property.images[0]
  const isJual       = property.listingType === "jual"

  const hasSpecs = property.type === "tanah"
    ? property.landArea != null
    : property.bedrooms != null || property.bathrooms != null || property.buildingArea != null

  return (
    <Link
      href={`/properti/${property.id}`}
      className="group block rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-lg hover:shadow-black/8 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* ── Image ───────────────────────────────────────────── */}
      <div className="relative h-52 bg-muted overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm">
            Tidak ada foto
          </div>
        )}

        {/* Bottom gradient so badges over dark images still read */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[10px] font-bold tracking-wide shadow-sm ${
              isJual
                ? "bg-amber-500 text-white shadow-amber-500/40"
                : "bg-sky-500  text-white shadow-sky-500/40"
            }`}
          >
            {isJual ? "Dijual" : "Disewa"}
          </span>
          <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm">
            {TYPE_LABEL[property.type]}
          </span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="p-4">
        {/* Price */}
        <p
          className="font-display font-bold text-amber-600 leading-tight mb-1.5"
          style={{ fontSize: "1.3rem" }}
        >
          {formatPrice(property.price, property.listingType)}
        </p>

        {/* Title */}
        <h3 className="text-[13.5px] font-semibold leading-snug text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors duration-200 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[12px] text-muted-foreground mb-3">
          <MapPin size={11} className="text-amber-500 shrink-0" />
          <span className="line-clamp-1">{property.address ?? property.city}</span>
        </div>

        {/* Specs */}
        {hasSpecs && (
          <div className="flex items-center gap-3.5 pt-2.5 border-t border-border/50 text-[12px] text-muted-foreground">
            {property.type === "tanah" ? (
              <span className="flex items-center gap-1">
                <Maximize2 size={11} className="text-amber-500/60" />
                {property.landArea} m²
              </span>
            ) : (
              <>
                {property.bedrooms != null && (
                  <span className="flex items-center gap-1">
                    <BedDouble size={11} className="text-amber-500/60" />
                    {property.bedrooms} KT
                  </span>
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bath size={11} className="text-amber-500/60" />
                    {property.bathrooms} KM
                  </span>
                )}
                {property.buildingArea != null && (
                  <span className="flex items-center gap-1">
                    <Maximize2 size={11} className="text-amber-500/60" />
                    {property.buildingArea} m²
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Amber slide-in accent line on hover */}
      <div
        className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: "linear-gradient(90deg, #F59E0B, #FBBF24)" }}
      />
    </Link>
  )
}
