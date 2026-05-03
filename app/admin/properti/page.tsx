"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { PROPERTY_TYPE_LABELS } from "@/lib/constants"

interface PropertyItem {
  id: string
  title: string
  type: string
  listingType: string
  city: string
  price: string
  status: string | null
}

export default function AdminPropertiesPage() {
  const [items, setItems] = useState<PropertyItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const limit = 20

  const fetchProperties = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", page.toString())
    params.set("limit", limit.toString())
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (typeFilter) params.set("type", typeFilter)

    fetch(`/api/properties?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? [])
        setTotal(data.total ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search, statusFilter, typeFilter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties()
  }, [fetchProperties])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProperties()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return
    await fetch(`/api/properties/${id}`, { method: "DELETE" })
    toast.success("Properti dihapus")
    fetchProperties()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properti</h1>
        <Button asChild size="sm">
          <Link href="/admin/properti/create">
            <Plus size={14} className="mr-1" />
            Tambah Properti
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari judul atau kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="sold">Terjual</SelectItem>
                <SelectItem value="rented">Tersewa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="rumah">Rumah</SelectItem>
                <SelectItem value="apartemen">Apartemen</SelectItem>
                <SelectItem value="tanah">Tanah</SelectItem>
                <SelectItem value="ruko">Ruko</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="secondary" size="sm">Cari</Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <p className="text-muted-foreground font-medium">
                {search || statusFilter || typeFilter
                  ? "Tidak ada hasil filter"
                  : "Belum ada properti"}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs mx-auto">
                {search || statusFilter || typeFilter
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Klik tombol Tambah Properti untuk menambah listing pertama"}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-3 font-medium">Judul</th>
                      <th className="text-left p-3 font-medium">Tipe</th>
                      <th className="text-left p-3 font-medium">Kota</th>
                      <th className="text-left p-3 font-medium">Harga</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium truncate max-w-44">{item.title}</td>
                        <td className="p-3 text-muted-foreground">
                          {PROPERTY_TYPE_LABELS[item.type] ?? item.type}
                        </td>
                        <td className="p-3 text-muted-foreground">{item.city}</td>
                        <td className="p-3 text-muted-foreground">
                          Rp {parseInt(item.price, 10).toLocaleString("id-ID")}
                        </td>
                        <td className="p-3">
                          <Badge variant={
                            item.status === "active" ? "default" : "secondary"
                          }>
                            {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : "Tersewa"}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" asChild>
                              <Link href={`/admin/properti/${item.id}/edit`}>
                                <Pencil size={14} />
                              </Link>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id, item.title)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm line-clamp-1 flex-1">{item.title}</p>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                          <Link href={`/admin/properti/${item.id}/edit`}>
                            <Pencil size={12} />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id, item.title)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{PROPERTY_TYPE_LABELS[item.type]}</span>
                      <span>&middot;</span>
                      <span>{item.city}</span>
                      <span>&middot;</span>
                      <span>Rp {parseInt(item.price, 10).toLocaleString("id-ID")}</span>
                    </div>
                    <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-[10px]">
                      {item.status === "active" ? "Aktif" : item.status === "sold" ? "Terjual" : "Tersewa"}
                    </Badge>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-muted-foreground">
                    {total} properti &middot; Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
