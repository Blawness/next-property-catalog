import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daftar — PropIndo",
  description: "Buat akun PropIndo gratis",
}

export default function DaftarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
