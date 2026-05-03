"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"

export default function HeroSearchForm() {
  const [city, setCity] = useState("")
  const [type, setType] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.set("city", city.trim())
    if (type) params.set("type", type)
    router.push(`/properti?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="hero-animate-search w-full max-w-lg mb-5">
      <div
        className="flex items-stretch rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        style={{ outline: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex flex-1 items-center gap-2.5 bg-white/97 px-4 min-w-0">
          <MapPin size={15} className="text-amber-600 shrink-0" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cari kota atau kawasan..."
            className="flex-1 py-4 text-[13px] font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400 min-w-0"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="hidden sm:block px-3 bg-white/93 border-l border-gray-200 text-[13px] text-gray-600 font-medium outline-none cursor-pointer shrink-0 hover:bg-white/98 transition-colors"
        >
          <option value="">Semua Tipe</option>
          <option value="rumah">Rumah</option>
          <option value="apartemen">Apartemen</option>
          <option value="tanah">Tanah</option>
          <option value="ruko">Ruko</option>
        </select>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 sm:px-6 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-[13px] font-bold tracking-wide transition-colors duration-150 shrink-0"
        >
          <Search size={15} />
          <span className="hidden sm:block">Cari</span>
        </button>
      </div>
    </form>
  )
}
