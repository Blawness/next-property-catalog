import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Katalog Properti — PropIndo",
  description: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
}

export default function PropertiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
