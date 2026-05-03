"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, ChevronDown, MapPin, LayoutGrid, Home } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"

const NAV_LINKS = [
  { href: "/",         label: "Home",      icon: Home },
  { href: "/properti", label: "Properti",  icon: LayoutGrid },
  { href: "/peta",     label: "Peta",      icon: MapPin },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-110 transition-transform duration-200" />
          <span
            className="font-display font-bold text-[1.35rem] text-foreground tracking-tight leading-none"
            style={{ fontStyle: "italic" }}
          >
            PropIndo
          </span>
        </Link>

        {/* ── Nav links ─────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group relative flex items-center gap-1.5
                  text-[11px] font-semibold tracking-[0.15em] uppercase
                  transition-colors duration-200
                  ${active ? "text-amber-600" : "text-foreground/50 hover:text-foreground/90"}
                `}
              >
                <Icon
                  size={13}
                  className={active ? "text-amber-500" : "text-foreground/40 group-hover:text-foreground/70 transition-colors"}
                />
                {label}
                {/* Underline indicator */}
                <span
                  className={`
                    absolute -bottom-[1.15rem] left-0 right-0 h-px bg-amber-500
                    transition-transform duration-300 origin-left
                    ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                />
              </Link>
            )
          })}
        </div>

        {/* ── Right side ────────────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />

          {session ? (
            <>
              {/* Dashboard / Pasang Iklan — desktop */}
              {session.user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-[12px] font-bold tracking-wide px-3.5 py-2 transition-colors duration-150 shadow-sm shadow-amber-500/30"
                >
                  <PlusCircle size={13} />
                  Dashboard
                </Link>
              ) : null}

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50">
                    <div className="h-7 w-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-amber-700">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-foreground/40 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  {/* User info header */}
                  <div className="px-3 py-2.5 border-b border-border/60">
                    <p className="text-[13px] font-semibold truncate leading-tight">
                      {session.user.name ?? "Pengguna"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>

                  <DropdownMenuItem asChild className="mt-1 cursor-pointer">
                    <Link href="/profil">Profil &amp; Favorit</Link>
                  </DropdownMenuItem>

                  {/* Mobile-only dashboard */}
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/masuk"
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700 text-[12px] font-bold tracking-wide px-3.5 py-2 transition-colors duration-150"
            >
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
