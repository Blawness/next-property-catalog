import Link from "next/link"
import Image from "next/image"
import { BRAND } from "@/lib/brand"
import { MapPin } from "lucide-react"

export default function PopularCities() {
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8">
        {BRAND.popularCities.heading}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BRAND.popularCities.cities.map((city) => (
          <Link
            key={city.name}
            href={`/properti?city=${city.name}`}
            className="group relative h-40 rounded-2xl overflow-hidden"
          >
            <Image
              src={city.image}
              alt={city.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="flex items-center gap-1.5 text-white font-semibold">
                <MapPin size={14} className="text-amber-400" />
                {city.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
