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
import { PlusCircle, ChevronDown, MapPin, LayoutGrid, Home } from "lucide-react"
import BrandMark from "@/components/BrandMark"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/",         label: "Home",     icon: Home },
  { href: "/properti", label: "Properti", icon: LayoutGrid },
  { href: "/peta",     label: "Peta",     icon: MapPin },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <BrandMark size="md" />
        </Link>

        <div className="hidden sm:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative inline-flex items-center gap-2 leading-none",
                  "font-sans text-[14px] font-medium",
                  "transition-colors duration-200",
                  active ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground",
                )}
              >
                <Icon
                  size={14}
                  strokeWidth={2.25}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70",
                  )}
                />
                {label}
                <span
                  className={cn(
                    "absolute -bottom-[1.15rem] left-0 right-0 h-[2px] origin-left transition-transform duration-200",
                    active ? "bg-primary scale-x-100" : "bg-primary scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            )
          })}
        </div>

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
