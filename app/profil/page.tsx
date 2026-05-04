"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import PropertyCard from "@/components/PropertyCard"
import { useFavorites } from "@/hooks/useFavorites"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfilPage() {
  const { data: session, status, update } = useSession()
  const isPending = status === "loading"
  const { favorites, loadingFavs } = useFavorites()
  const [uploading, setUploading] = useState(false)

  const saveAvatar = async (url: string) => {
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    })
    if (!res.ok) {
      toast.error("Gagal menyimpan foto profil")
      return
    }
    await update()
    toast.success("Foto profil diperbarui")
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Kamu harus masuk terlebih dahulu.</p>
        <Button asChild>
          <Link href="/masuk">Masuk Sekarang</Link>
        </Button>
      </div>
    )
  }

  const userImage = session.user.image

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-14 w-14" size="lg">
                {userImage ? (
                  <AvatarImage src={userImage} alt={session.user.name ?? ""} />
                ) : null}
                <AvatarFallback className="text-lg">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity ${
                uploading ? "opacity-100 bg-black/50" : "opacity-0 group-hover:opacity-100 bg-black/40"
              }`}>
                {uploading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <UploadButton<OurFileRouter, "profileImage">
                    endpoint="profileImage"
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={(res) => {
                      setUploading(false)
                      const url = res?.[0]?.ufsUrl
                      if (url) saveAvatar(url)
                    }}
                    onUploadError={(err) => {
                      setUploading(false)
                      toast.error(`Upload gagal: ${err.message}`)
                    }}
                    appearance={{
                      button: "h-14 w-14 rounded-full flex items-center justify-center bg-transparent hover:bg-transparent ut-ready:bg-transparent ut-uploading:bg-transparent",
                      container: "",
                      allowedContent: "hidden",
                    }}
                    content={{
                      button: <Camera size={16} className="text-white" />,
                    }}
                  />
                )}
              </div>
            </div>
            <div>
              <CardTitle>{session.user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Properti Favorit</h2>
        {loadingFavs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl">
            <p>Belum ada favorit.</p>
            <Button variant="ghost" className="mt-2" asChild>
              <Link href="/properti">Jelajahi Properti</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
