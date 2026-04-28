"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Map, PlusCircle, LogIn } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-primary">
          PropIndo
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/properti">
              <Home className="h-4 w-4 mr-1" />
              Properti
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/peta">
              <Map className="h-4 w-4 mr-1" />
              Peta
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button size="sm" asChild>
                <Link href="/pasang-iklan">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Pasang Iklan
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="text-xs">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profil">Profil & Favorit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive"
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/masuk">
                <LogIn className="h-4 w-4 mr-1" />
                Masuk
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
