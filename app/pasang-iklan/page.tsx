"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import Link from "next/link"
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/constants"

export default function PasangIklanPage() {
  const { data: session, status } = useSession()
  const isPending = status === "loading"
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "rumah",
    listingType: "jual",
    city: "",
    address: "",
    lat: "",
    lng: "",
    landArea: "",
    buildingArea: "",
    bedrooms: "",
    bathrooms: "",
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrls }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Gagal menyimpan properti.")
      setLoading(false)
      return
    }

    const data = await res.json()
    router.push(`/properti/${data.id}`)
  }

  if (isPending) return null

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Kamu harus masuk untuk pasang iklan.</p>
        <Button asChild>
          <Link href="/masuk">Masuk Sekarang</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Pasang Iklan Properti</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="title">Judul Iklan</Label>
                <Input
                  id="title"
                  placeholder="Rumah 3KT di Kebayoran Baru"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="type">Tipe Properti</Label>
                <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="listingType">Jual / Sewa</Label>
                <Select value={form.listingType} onValueChange={(v) => setField("listingType", v)}>
                  <SelectTrigger id="listingType"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(LISTING_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="500000000"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="city">Kota</Label>
                <Input
                  id="city"
                  placeholder="Jakarta"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  placeholder="Jl. Contoh No. 1"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="landArea">Luas Tanah (m²)</Label>
                <Input
                  id="landArea"
                  type="number"
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="buildingArea">Luas Bangunan (m²)</Label>
                <Input
                  id="buildingArea"
                  type="number"
                  value={form.buildingArea}
                  onChange={(e) => setField("buildingArea", e.target.value)}
                />
              </div>

              {form.type !== "tanah" && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="bedrooms">Kamar Tidur</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={form.bedrooms}
                      onChange={(e) => setField("bedrooms", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bathrooms">Kamar Mandi</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={form.bathrooms}
                      onChange={(e) => setField("bathrooms", e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <Label htmlFor="lat">Latitude (opsional)</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="-6.2088"
                  value={form.lat}
                  onChange={(e) => setField("lat", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lng">Longitude (opsional)</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="106.8456"
                  value={form.lng}
                  onChange={(e) => setField("lng", e.target.value)}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm resize-y"
                  placeholder="Ceritakan detail properti..."
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Foto Properti</Label>
                <UploadButton<OurFileRouter, "propertyImages">
                  endpoint="propertyImages"
                  onClientUploadComplete={(res) => {
                    setImageUrls((prev) => [...prev, ...res.map((r) => r.url)])
                  }}
                  onUploadError={(err) => setError(`Upload error: ${err.message}`)}
                />
                {imageUrls.length > 0 && (
                  <p className="text-sm text-muted-foreground">{imageUrls.length} foto terupload</p>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Pasang Iklan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
