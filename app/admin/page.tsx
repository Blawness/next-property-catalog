"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Building, CheckCircle, Users, Calendar } from "lucide-react"

interface Stats {
  totalProperties: number
  activeProperties: number
  totalAgents: number
  propertiesThisMonth: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const cards = [
    { label: "Total Properti", value: stats?.totalProperties ?? 0, icon: Building, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Properti Aktif", value: stats?.activeProperties ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Agent", value: stats?.totalAgents ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Bulan Ini", value: stats?.propertiesThisMonth ?? 0, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon size={16} className={color} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
