export const PROPERTY_TYPES = ["rumah", "apartemen", "tanah", "ruko"] as const

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  rumah: "Rumah",
  apartemen: "Apartemen",
  tanah: "Tanah",
  ruko: "Ruko",
}

export const LISTING_TYPES = ["jual", "sewa"] as const

export const LISTING_TYPE_LABELS: Record<string, string> = {
  jual: "Dijual",
  sewa: "Disewa",
}

export const CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
  "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi",
  "Bogor", "Bali", "Yogyakarta",
]

export function formatPriceCompact(price: string, listingType: string): string {
  const num = parseInt(price, 10)
  const formatted =
    num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)} M`
      : num >= 1_000_000
        ? `${(num / 1_000_000).toFixed(0)} Jt`
        : num.toLocaleString("id-ID")
  return `Rp ${formatted}${listingType === "sewa" ? "/bln" : ""}`
}

export function formatPriceFull(price: string, listingType: string): string {
  const num = parseInt(price, 10)
  const base =
    num >= 1_000_000_000
      ? `Rp ${(num / 1_000_000_000).toFixed(2)} Miliar`
      : num >= 1_000_000
        ? `Rp ${(num / 1_000_000).toFixed(0)} Juta`
        : `Rp ${num.toLocaleString("id-ID")}`
  return listingType === "sewa" ? `${base}/bulan` : base
}
