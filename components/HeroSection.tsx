"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { BRAND } from "@/lib/brand"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-[78vh] min-h-[560px] max-h-[820px]">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&auto=format&q=80"
        alt={BRAND.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 40%, oklch(0.72 0.09 78 / 0.6) 50%, transparent 60%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <h1 className="font-sans text-white tracking-tight leading-[1.05]">
          <span className="block font-light italic text-3xl sm:text-4xl md:text-5xl">
            Discover Your Mission
          </span>
          <span className="block font-bold text-4xl sm:text-5xl md:text-6xl mt-2">
            Build Our Passion
          </span>
        </h1>

        <p className="mt-5 max-w-md text-sm sm:text-base text-white/70 leading-relaxed">
          {BRAND.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/properti"
            className="btn-press inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            BOOK NOW <span aria-hidden>→</span>
          </Link>
          <Link
            href="/masuk"
            className="btn-press inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10"
          >
            FOR SELLER
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-1 pointer-events-none">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium">
            Scroll
          </span>
          <ChevronDown size={16} className="text-white/40" />
        </div>
      </div>
    </section>
  )
}
