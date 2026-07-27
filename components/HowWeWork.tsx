import {
  MessageCircle,
  Search,
  FileCheck,
  Handshake,
  type LucideIcon,
} from "lucide-react"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

const ICONS: Record<string, LucideIcon> = {
  MessageCircle,
  Search,
  FileCheck,
  Handshake,
}

export default function HowWeWork() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Layanan"
        title={BRAND.howWeWork.heading}
        subtitle={BRAND.howWeWork.subtitle}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BRAND.howWeWork.steps.map((step, i) => {
          const Icon = ICONS[step.icon]
          return (
            <Reveal key={step.title} delay={i * 80}>
              <div className="flex h-full flex-col items-center rounded-2xl border-2 border-primary bg-background p-7 text-center transition-colors hover:bg-primary/5">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-sans text-[17px] font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
