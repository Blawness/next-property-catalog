import Link from "next/link"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants"
import { BRAND } from "@/lib/brand"

const ICONS: Record<string, string> = {
  rumah: "🏠",
  apartemen: "🏢",
  tanah: "🌿",
  ruko: "🏪",
}

export default function ExploreTypes() {
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8">
        {BRAND.exploreTypes.heading}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PROPERTY_TYPES.map((type) => (
          <Link
            key={type}
            href={`/properti?type=${type}`}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border/60 bg-card hover:border-amber-400/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {ICONS[type]}
            </span>
            <span className="font-semibold text-sm text-foreground group-hover:text-amber-600 transition-colors">
              {PROPERTY_TYPE_LABELS[type]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
