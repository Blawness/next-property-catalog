const STATS = [
  { n: "15.000+", label: "Properti Aktif" },
  { n: "34", label: "Provinsi" },
  { n: "500+", label: "Agen Terpercaya" },
]

export default function HeroStats() {
  return (
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
  )
}
