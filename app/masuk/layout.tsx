import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Masuk — PropIndo",
  description: "Masuk ke akun PropIndo kamu",
}

export default function MasukLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
