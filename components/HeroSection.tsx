"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden h-[78vh] min-h-[560px] max-h-[820px]"
    >
      <Image
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
        alt="Commercial skyscraper"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 42%" }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, rgba(255,255,255,.92) 26%, rgba(255,255,255,.35) 48%, rgba(255,255,255,0) 66%)",
        }}
      />

      <div className="relative h-full flex flex-col items-center pt-[105px]">
        <h1 className="m-0 text-center font-sans text-foreground leading-[1.05] tracking-[-0.015em] text-balance text-[clamp(2rem,5.2vw,3.94rem)]">
          <span className="block font-light italic">Discover Your Mission</span>
          <span className="block font-bold">Build Our Passion</span>
        </h1>

        <div className="mt-auto mb-[76px] flex flex-wrap items-center justify-center gap-[clamp(2rem,5vw,5.5rem)]">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 h-11 px-[26px] rounded-full font-sans text-[19px] font-bold tracking-[0.05em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book now
            <ChevronRight size={17} strokeWidth={2.1} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full font-sans text-[19px] font-bold tracking-[0.05em] uppercase bg-[#111] text-white hover:bg-black/80 transition-colors"
          >
            For seller
          </a>
        </div>
      </div>
    </section>
  )
}
