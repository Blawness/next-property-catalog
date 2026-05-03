import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "PropIndo – Katalog Properti Indonesia",
  description: "Temukan rumah, apartemen, tanah, dan ruko terbaik di Indonesia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  )
}
