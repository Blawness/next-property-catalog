"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { usePropertyForm } from "@/hooks/usePropertyForm"
import PropertyFormFields from "@/components/PropertyFormFields"
import ImageUploadSection from "@/components/ImageUploadSection"

export default function PasangIklanPage() {
  const { data: session, status } = useSession()
  const isPending = status === "loading"
  const { fields, imageUrls, setField, setImageUrls, setError, handleSubmit, loading, error } =
    usePropertyForm()

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
            <PropertyFormFields fields={fields} setField={setField} />
            <ImageUploadSection imageUrls={imageUrls} setImageUrls={setImageUrls} onError={setError} />

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
