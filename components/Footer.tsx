import Link from "next/link"
import { BRAND } from "@/lib/brand"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span
                className="font-display font-bold text-xl italic text-foreground"
              >
                {BRAND.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">{BRAND.footer.tagline}</p>
          </div>

          <div className="flex items-center gap-6">
            {BRAND.footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
