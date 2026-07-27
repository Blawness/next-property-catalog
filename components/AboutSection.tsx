import Image from "next/image"
import SectionHeading from "@/components/SectionHeading"
import Reveal from "@/components/Reveal"
import { BRAND } from "@/lib/brand"

export default function AboutSection() {
  return (
    <section id="tentang" className="container mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Tentang Kami"
        title={BRAND.about.heading}
        subtitle={BRAND.about.subtitle}
      />

      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
            {BRAND.about.body}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <Image
              src={BRAND.about.image}
              alt="Gedung pencakar langit"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 divide-y divide-border sm:mt-16 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {BRAND.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="px-6 py-8 text-center sm:py-2">
              <p className="font-sans text-5xl font-bold text-primary sm:text-6xl">{s.n}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
