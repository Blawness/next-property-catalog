import Link from "next/link"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "@/lib/constants"

const PROPERTY_TYPE_ICONS: Record<string, string> = {
  rumah: "🏠",
  apartemen: "🏢",
  tanah: "🌿",
  ruko: "🏪",
}

export default function HeroPropertyTypePills() {
  return (
    <div className="hero-animate-pills flex gap-2 flex-wrap justify-center mb-9">
      {PROPERTY_TYPES.map((t) => (
        <Link
          key={t}
          href={`/properti?type=${t}`}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white/75 text-xs font-medium hover:bg-white/20 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-200 backdrop-blur-sm"
        >
          <span>{PROPERTY_TYPE_ICONS[t]}</span>
          <span>{PROPERTY_TYPE_LABELS[t]}</span>
        </Link>
      ))}
    </div>
  )
}
