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

// All formatters guard against unparseable / empty / non-finite input by
// rendering an em-dash placeholder. This prevents "Rp NaN" from ever reaching
// the public catalog if a row's price column is ever set to a non-numeric value
// (e.g. via a future API change, a manual DB edit, or a soft-delete path).
function safePriceLabel(price: string, listingType: string, suffixPerType: string): string {
  const num = Number.parseInt(price, 10)
  if (!Number.isFinite(num) || num < 0) return "—"
  const body =
    num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)} M`
      : num >= 1_000_000
        ? `${(num / 1_000_000).toFixed(0)} Jt`
        : num.toLocaleString("id-ID")
  return `Rp ${body}${listingType === "sewa" ? suffixPerType : ""}`
}

export function formatPriceCompact(price: string, listingType: string): string {
  return safePriceLabel(price, listingType, "/bln")
}

export function formatPriceCompactValue(price: string, listingType: string): {
  prefix: string
  value: string
  suffix: string
} {
  const num = Number.parseInt(price, 10)
  if (!Number.isFinite(num) || num < 0) {
    return { prefix: "Rp", value: "—", suffix: "" }
  }
  const value =
    num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)} M`
      : num >= 1_000_000
        ? `${(num / 1_000_000).toFixed(0)} Jt`
        : num.toLocaleString("id-ID")
  return { prefix: "Rp", value, suffix: listingType === "sewa" ? "/bln" : "" }
}

export function formatPriceFull(price: string, listingType: string): string {
  const num = Number.parseInt(price, 10)
  if (!Number.isFinite(num) || num < 0) return "—"
  const base =
    num >= 1_000_000_000
      ? `Rp ${(num / 1_000_000_000).toFixed(2)} Miliar`
      : num >= 1_000_000
        ? `Rp ${(num / 1_000_000).toFixed(0)} Juta`
        : `Rp ${num.toLocaleString("id-ID")}`
  return listingType === "sewa" ? `${base}/bulan` : base
}
