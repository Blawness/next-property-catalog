"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal, X } from "lucide-react"
import { CITIES, PROPERTY_TYPES, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"

export default function PropertyFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "semua") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`/properti?${params.toString()}`)
  }

  function clearFilters() {
    router.push("/properti")
  }

  const hasFilters = Array.from(searchParams.keys()).length > 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          Filter
        </h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Tipe Properti</Label>
          <Select
            value={searchParams.get("type") ?? "semua"}
            onValueChange={(v) => updateFilter("type", v)}
          >
            <SelectTrigger className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tipe</SelectItem>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Jual / Sewa</Label>
          <Select
            value={searchParams.get("listingType") ?? "semua"}
            onValueChange={(v) => updateFilter("listingType", v)}
          >
            <SelectTrigger className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              {Object.entries(LISTING_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Kota</Label>
          <Select
            value={searchParams.get("city") ?? "semua"}
            onValueChange={(v) => updateFilter("city", v)}
          >
            <SelectTrigger className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Semua Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kota</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Harga Min (Juta)</Label>
          <Input
            type="number"
            placeholder="Contoh: 500"
            className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => updateFilter("minPrice", e.target.value ? String(Number(e.target.value) * 1_000_000) : "")}
          />
        </div>

        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Harga Max (Juta)</Label>
          <Input
            type="number"
            placeholder="Contoh: 2000"
            className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => updateFilter("maxPrice", e.target.value ? String(Number(e.target.value) * 1_000_000) : "")}
          />
        </div>

        <div>
          <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 mb-1 block">Min Kamar Tidur</Label>
          <Select
            value={searchParams.get("minBedrooms") ?? "semua"}
            onValueChange={(v) => updateFilter("minBedrooms", v)}
          >
            <SelectTrigger className="h-9 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
