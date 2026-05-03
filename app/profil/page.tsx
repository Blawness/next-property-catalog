"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import PropertyCard from "@/components/PropertyCard"
import { useFavorites } from "@/hooks/useFavorites"

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const isPending = status === "loading"
  const { favorites, loadingFavs } = useFavorites()

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
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
