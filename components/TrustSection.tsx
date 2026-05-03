import { BRAND } from "@/lib/brand"
import { Building, Search, Shield } from "lucide-react"

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building,
  Search,
  Shield,
}

export default function TrustSection() {
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8">
        {BRAND.trust.heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {BRAND.trust.items.map((item) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <div key={item.title} className="text-center p-6 rounded-2xl border border-border/60 bg-card">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
