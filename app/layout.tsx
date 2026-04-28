import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "PropIndo – Katalog Properti Indonesia",
  description: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
