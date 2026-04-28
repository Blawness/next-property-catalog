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

const CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
  "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi",
  "Bogor", "Bali", "Yogyakarta",
]

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
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
          <Label className="text-xs text-muted-foreground mb-1 block">Tipe Properti</Label>
          <Select
            value={searchParams.get("type") ?? "semua"}
            onValueChange={(v) => updateFilter("type", v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tipe</SelectItem>
              <SelectItem value="rumah">Rumah</SelectItem>
              <SelectItem value="apartemen">Apartemen</SelectItem>
              <SelectItem value="tanah">Tanah</SelectItem>
              <SelectItem value="ruko">Ruko</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Jual / Sewa</Label>
          <Select
            value={searchParams.get("listingType") ?? "semua"}
            onValueChange={(v) => updateFilter("listingType", v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="jual">Dijual</SelectItem>
              <SelectItem value="sewa">Disewa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Kota</Label>
          <Select
            value={searchParams.get("city") ?? "semua"}
            onValueChange={(v) => updateFilter("city", v)}
          >
            <SelectTrigger className="h-8 text-sm">
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
          <Label className="text-xs text-muted-foreground mb-1 block">Harga Min (Juta)</Label>
          <Input
            type="number"
            placeholder="Contoh: 500"
            className="h-8 text-sm"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => updateFilter("minPrice", e.target.value ? String(Number(e.target.value) * 1_000_000) : "")}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Harga Max (Juta)</Label>
          <Input
            type="number"
            placeholder="Contoh: 2000"
            className="h-8 text-sm"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => updateFilter("maxPrice", e.target.value ? String(Number(e.target.value) * 1_000_000) : "")}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Min Kamar Tidur</Label>
          <Select
            value={searchParams.get("minBedrooms") ?? "semua"}
            onValueChange={(v) => updateFilter("minBedrooms", v)}
          >
            <SelectTrigger className="h-8 text-sm">
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
