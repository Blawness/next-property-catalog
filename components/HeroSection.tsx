"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, ChevronDown, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

const PROPERTY_TYPE_LINKS = [
  { label: "Rumah",     icon: "🏠", href: "/properti?type=rumah" },
  { label: "Apartemen", icon: "🏢", href: "/properti?type=apartemen" },
  { label: "Tanah",     icon: "🌿", href: "/properti?type=tanah" },
  { label: "Ruko",      icon: "🏪", href: "/properti?type=ruko" },
]

const STATS = [
  { n: "15.000+", label: "Properti Aktif" },
  { n: "34",      label: "Provinsi" },
  { n: "500+",    label: "Agen Terpercaya" },
]

export default function HeroSection() {
  const bgRef   = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number>(0)
  const [city,  setCity]  = useState("")
  const [type,  setType]  = useState("")
  const router  = useRouter()

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.set("city", city.trim())
    if (type)        params.set("type", type)
    router.push(`/properti?${params.toString()}`)
  }

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
          alt="PropIndo — Properti Premium Indonesia"
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
        style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.7) 40%, rgba(251,191,36,0.7) 60%, transparent)" }}
      />

      {/* ── Main content ────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">

        {/* Badge */}
        <div className="hero-animate-badge mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-sm">
          <Sparkles size={10} className="text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-300">
            Platform Properti #1 Indonesia
          </span>
        </div>

        {/* Headline */}
        <h1
          className="hero-animate-h1 font-display text-center text-white leading-[0.92] tracking-tight mb-5 select-none"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
        >
          <span className="block font-semibold">Temukan</span>
          <span
            className="block text-amber-400"
            style={{ fontStyle: "italic", fontSize: "1.08em" }}
          >
            Properti
          </span>
          <span className="block font-semibold">Impianmu</span>
        </h1>

        {/* Decorative divider */}
        <div className="hero-animate-sub flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-amber-400/40" />
          <TrendingUp size={13} className="text-amber-400/60" />
          <div className="h-px w-12 bg-amber-400/40" />
        </div>

        {/* Subtitle */}
        <p className="hero-animate-sub text-center text-white/55 text-sm sm:text-[15px] max-w-xs sm:max-w-sm leading-relaxed mb-7">
          Ribuan listing rumah, apartemen, tanah &amp; ruko pilihan<br className="hidden sm:block" />
          di seluruh Indonesia dengan harga terbaik
        </p>

        {/* ── Search bar ──────────────────────────────────── */}
        <form
          onSubmit={handleSearch}
          className="hero-animate-search w-full max-w-lg mb-5"
        >
          <div
            className="flex items-stretch rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            style={{ outline: "1px solid rgba(255,255,255,0.12)" }}
          >
            {/* City input */}
            <div className="flex flex-1 items-center gap-2.5 bg-white/97 px-4 min-w-0">
              <MapPin size={15} className="text-amber-600 shrink-0" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Cari kota atau kawasan..."
                className="flex-1 py-4 text-[13px] font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400 min-w-0"
              />
            </div>

            {/* Type select */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="hidden sm:block px-3 bg-white/93 border-l border-gray-200 text-[13px] text-gray-600 font-medium outline-none cursor-pointer shrink-0 hover:bg-white/98 transition-colors"
            >
              <option value="">Semua Tipe</option>
              <option value="rumah">Rumah</option>
              <option value="apartemen">Apartemen</option>
              <option value="tanah">Tanah</option>
              <option value="ruko">Ruko</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 sm:px-6 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-[13px] font-bold tracking-wide transition-colors duration-150 shrink-0"
            >
              <Search size={15} />
              <span className="hidden sm:block">Cari</span>
            </button>
          </div>
        </form>

        {/* ── Property type pills ───────────────────────────── */}
        <div className="hero-animate-pills flex gap-2 flex-wrap justify-center mb-9">
          {PROPERTY_TYPE_LINKS.map(t => (
            <Link
              key={t.label}
              href={t.href}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white/75 text-xs font-medium hover:bg-white/20 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-200 backdrop-blur-sm"
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          ))}
        </div>

        {/* ── Stats ─────────────────────────────────────────── */}
        <div className="hero-animate-stats flex items-center gap-6 sm:gap-10">
          {STATS.map(({ n, label }, i) => (
            <div key={label} className="flex items-center gap-4 sm:gap-10">
              {i > 0 && <div className="hidden sm:block h-8 w-px bg-white/15" />}
              <div className="text-center">
                <p
                  className="font-display font-bold text-white"
                  style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
                >
                  {n}
                </p>
                <p className="text-white/40 text-[11px] mt-0.5 tracking-wide">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll cue ──────────────────────────────────────── */}
      <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-1 pointer-events-none">
        <div className="hero-scroll-cue flex flex-col items-center gap-1">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-medium">Scroll</span>
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
