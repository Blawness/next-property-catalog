import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Building, Users, LogOut } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/masuk")
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-card flex flex-col shrink-0">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-display font-bold text-lg italic">PropIndo</span>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold ml-auto">
              ADMIN
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <SidebarLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink href="/admin/properti" icon={Building} label="Properti" />
          <SidebarLink href="/admin/agent" icon={Users} label="Agent" />
        </nav>
        <div className="p-3 border-t">
          <div className="text-xs text-muted-foreground px-2 mb-2 truncate">
            {session.user.email}
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={14} />
            Kembali ke Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0 bg-muted/30">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <Icon size={16} />
      {label}
    </Link>
  )
}
