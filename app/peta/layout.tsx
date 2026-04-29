import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Peta Properti — PropIndo",
  description: "Lihat lokasi properti di peta interaktif",
}

export default function PetaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
