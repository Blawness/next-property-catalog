export const BRAND = {
  name: "PropIndo",

  fullName: "PropIndo — Properti Premium Indonesia",

  tagline: "Platform Properti #1 Indonesia",

  headline: ["Temukan", "Properti", "Impianmu"] as const,

  description: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",

  stats: [
    { n: "15.000+", label: "Properti Aktif" },
    { n: "34", label: "Provinsi" },
    { n: "500+", label: "Agen Terpercaya" },
  ] as const,

  heroImageAlt: "PropIndo — Properti Premium Indonesia",

  pageTitle: {
    home: "PropIndo – Katalog Properti Indonesia",
    catalog: "Katalog Properti — PropIndo",
    map: "Peta Properti — PropIndo",
    login: "Masuk — PropIndo",
    register: "Daftar — PropIndo",
    propertyNotFound: "Properti Tidak Ditemukan — PropIndo",
    catalogHeading: "Katalog Properti",
  },

  pageDescription: {
    home: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
    catalog: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
    register: "Buat akun PropIndo gratis",
    login: "Masuk ke akun PropIndo kamu",
  },

  loginDescription: "Masuk ke akun PropIndo kamu",
  registerDescription: "Buat akun PropIndo gratis",
}

export function brandTitle(title: string): string {
  return `${title} — ${BRAND.name}`
}
