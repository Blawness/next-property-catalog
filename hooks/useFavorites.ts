"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { PropertyWithImages } from "@/lib/types"

export function useFavorites() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<PropertyWithImages[]>([])
  const [loadingFavs, setLoadingFavs] = useState(true)

  useEffect(() => {
    if (!session) return
    fetch("/api/favorites")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch favorites")
        return r.json()
      })
      .then((data) => setFavorites(data.favorites ?? []))
      .catch(() => setFavorites([]))
      .finally(() => setLoadingFavs(false))
  }, [session])

  return { favorites, loadingFavs }
}
