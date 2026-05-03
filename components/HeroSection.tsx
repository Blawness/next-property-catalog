"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronDown, Sparkles, TrendingUp } from "lucide-react"
import HeroSearchForm from "@/components/HeroSearchForm"
import HeroPropertyTypePills from "@/components/HeroPropertyTypePills"
import HeroStats from "@/components/HeroStats"
import { BRAND } from "@/lib/brand"

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.42}px)`
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden hero-grain"
      style={{ height: "calc(100vh - 56px)", minHeight: 580, maxHeight: 920 }}
    >
      {/* ── Parallax background ─────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: "-14%", bottom: "-14%" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1200&fit=crop&auto=format&q=85"
          alt={BRAND.heroImageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ── Gradient overlays ───────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/88" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

      {/* ── Decorative gold line (top) ──────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-px hero-animate-line"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251,191,36,0.7) 40%, rgba(251,191,36,0.7) 60%, transparent)",
        }}
      />

      {/* ── Main content ────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Badge */}
        <div className="hero-animate-badge mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-sm">
          <Sparkles size={10} className="text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-300">
            {BRAND.tagline}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="hero-animate-h1 font-display text-center text-white leading-[0.92] tracking-tight mb-5 select-none"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
        >
          <span className="block font-semibold">{BRAND.headline[0]}</span>
          <span
            className="block text-amber-400"
            style={{ fontStyle: "italic", fontSize: "1.08em" }}
          >
            {BRAND.headline[1]}
          </span>
          <span className="block font-semibold">{BRAND.headline[2]}</span>
        </h1>

        {/* Decorative divider */}
        <div className="hero-animate-sub flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-amber-400/40" />
          <TrendingUp size={13} className="text-amber-400/60" />
          <div className="h-px w-12 bg-amber-400/40" />
        </div>

        {/* Subtitle */}
        <p className="hero-animate-sub text-center text-white/55 text-sm sm:text-[15px] max-w-xs sm:max-w-sm leading-relaxed mb-7">
          Ribuan listing rumah, apartemen, tanah &amp; ruko pilihan
          <br className="hidden sm:block" />
          di seluruh Indonesia dengan harga terbaik
        </p>

        <HeroSearchForm />
        <HeroPropertyTypePills />
        <HeroStats />
      </div>

      {/* ── Scroll cue ──────────────────────────────────────── */}
      <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-1 pointer-events-none">
        <div className="hero-scroll-cue flex flex-col items-center gap-1">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-medium">
            Scroll
          </span>
          <ChevronDown size={16} className="text-white/25" />
        </div>
      </div>

      {/* ── Bottom wave transition to page bg ───────────────── */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 64"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 L1440,64 L1440,32 Q1100,4 720,16 Q340,28 0,4 Z"
            style={{ fill: "var(--background)" }}
          />
        </svg>
      </div>
    </section>
  )
}
