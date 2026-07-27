"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, ChevronDown } from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/#home",    label: "Home",       id: "home" },
  { href: "/#about",   label: "About us",   id: "about" },
  { href: "/#how",     label: "How we work", id: "how" },
  { href: "/properti", label: "Listings",   id: "listings" },
  { href: "/#contact", label: "Contacts",   id: "contact" },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mockup-assets/logo web tap catalog.png"
            alt={BRAND.name}
            style={{ display: "block", width: 154, height: 48 }}
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center"
          style={{ gap: "58px", fontSize: "21px", fontWeight: 500 }}
        >
          {NAV_LINKS.map(({ href, label, id }) => {
            const active = id === "home" ? pathname === "/" : pathname === href || pathname.startsWith(href.replace(/#.*$/, ""))
            return (
              <a
                key={id}
                href={href}
                data-nav={id}
                className={cn(
                  "transition-colors",
                  active
                    ? "text-primary font-bold"
                    : "text-primary/45 hover:text-primary",
                )}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {session ? (
            <>
              {session.user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[12px] font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <PlusCircle size={13} />
                  Dashboard
                </Link>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="h-7 w-7 rounded-full bg-secondary border-2 border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt=""
                          width={28}
                          height={28}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-bold text-primary">
                          {session.user.name?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      )}
                    </div>
                    <ChevronDown size={12} className="text-foreground/40 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2.5 border-b border-border">
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
              className="flex items-center gap-1.5 rounded-xl border border-primary px-3.5 py-2 text-[12px] font-semibold tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
