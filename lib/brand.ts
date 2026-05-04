export const BRAND = {
  name: "Tiga Anak Propertindo",

  fullName: "Tiga Anak Propertindo — Properti Premium Indonesia",

  tagline: "Platform Properti #1 Indonesia",

  headline: ["Temukan", "Properti", "Impianmu"] as const,

  description: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",

  stats: [
    { n: "15.000+", label: "Properti Aktif" },
    { n: "34", label: "Provinsi" },
    { n: "500+", label: "Agen Terpercaya" },
  ] as const,

  heroImageAlt: "Tiga Anak Propertindo — Properti Premium Indonesia",

  pageTitle: {
    home: "Tiga Anak Propertindo – Katalog Properti Indonesia",
    catalog: "Katalog Properti — Tiga Anak Propertindo",
    map: "Peta Properti — Tiga Anak Propertindo",
    login: "Masuk — Tiga Anak Propertindo",
    register: "Daftar — Tiga Anak Propertindo",
    propertyNotFound: "Properti Tidak Ditemukan — Tiga Anak Propertindo",
    catalogHeading: "Katalog Properti",
  },

  pageDescription: {
    home: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
    catalog: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
    register: "Buat akun Tiga Anak Propertindo gratis",
    login: "Masuk ke akun Tiga Anak Propertindo kamu",
  },

  loginDescription: "Masuk ke akun Tiga Anak Propertindo kamu",
  registerDescription: "Buat akun Tiga Anak Propertindo gratis",

  exploreTypes: {
    heading: "Jelajahi Tipe Properti",
  },

  popularCities: {
    heading: "Kota Populer",
    cities: [
      { name: "Jakarta", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&h=400&fit=crop&auto=format" },
      { name: "Bandung", image: "https://images.unsplash.com/photo-1707993467310-a5b2bb858d68?w=600&h=400&fit=crop&auto=format" },
      { name: "Surabaya", image: "https://images.unsplash.com/photo-1698139603356-d8c63b9aacce?w=600&h=400&fit=crop&auto=format" },
      { name: "Yogyakarta", image: "https://images.unsplash.com/photo-1722444924699-391078e83ad6?w=600&h=400&fit=crop&auto=format" },
      { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format" },
      { name: "Semarang", image: "https://images.unsplash.com/photo-1657594873796-4a121883192a?w=600&h=400&fit=crop&auto=format" },
    ],
  },

  trust: {
    heading: "Mengapa Tiga Anak Propertindo?",
    items: [
      { icon: "Building", title: "Ribuan Listing", description: "Properti terkurasi di seluruh Indonesia" },
      { icon: "Search", title: "Pencarian Mudah", description: "Filter lengkap untuk temukan properti ideal" },
      { icon: "Shield", title: "Info Lengkap", description: "Foto, spesifikasi, lokasi dalam satu tempat" },
    ],
  },

  footer: {
    tagline: "Platform properti terpercaya di Indonesia",
    links: [
      { label: "Home", href: "/" },
      { label: "Properti", href: "/properti" },
      { label: "Peta", href: "/peta" },
    ],
  },
}

export function brandTitle(title: string): string {
  return `${title} — ${BRAND.name}`
}
