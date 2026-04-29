"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [type, setType] = useState("")
  const [listingType, setListingType] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (type && type !== "semua") params.set("type", type)
    if (listingType && listingType !== "semua") params.set("listingType", listingType)
    router.push(`/properti?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-3xl">
      <Input
        placeholder="Cari kota, daerah..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1"
      />
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Tipe</SelectItem>
          {PROPERTY_TYPES.map((t) => (
            <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={listingType} onValueChange={setListingType}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Jual/Sewa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua</SelectItem>
          {Object.entries(LISTING_TYPE_LABELS).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="shrink-0">
        <Search className="h-4 w-4 mr-2" />
        Cari
      </Button>
    </div>
  )
}
