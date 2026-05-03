"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Agent {
  id: string
  fullName: string
  email: string
  phone: string | null
  propertyCount: number
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formError, setFormError] = useState("")
  const [formSaving, setFormSaving] = useState(false)
  const [createdPassword, setCreatedPassword] = useState("")

  const fetchAgents = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/agents")
      .then((r) => r.json())
      .then((data) => setAgents(data.agents ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAgents()
  }, [fetchAgents])

  const openCreate = () => {
    setEditId(null)
    setFormName("")
    setFormEmail("")
    setFormPhone("")
    setFormError("")
    setCreatedPassword("")
    setDialogOpen(true)
  }

  const openEdit = (agent: Agent) => {
    setEditId(agent.id)
    setFormName(agent.fullName)
    setFormEmail(agent.email)
    setFormPhone(agent.phone ?? "")
    setFormError("")
    setCreatedPassword("")
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSaving(true)
    setFormError("")

    if (editId) {
      const res = await fetch(`/api/admin/agents/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, phone: formPhone }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFormError(data.error ?? "Gagal menyimpan.")
        setFormSaving(false)
        return
      }
    } else {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, phone: formPhone }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFormError(data.error ?? "Gagal membuat agent.")
        setFormSaving(false)
        return
      }
      const data = await res.json()
      setCreatedPassword(data.tempPassword)
    }

    setFormSaving(false)
    setDialogOpen(false)
    fetchAgents()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus agent "${name}"? Properti mereka akan dialihkan ke admin.`)) return
    await fetch(`/api/admin/agents/${id}`, { method: "DELETE" })
    fetchAgents()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agent</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus size={14} className="mr-1" />
          Tambah Agent
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : agents.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">Belum ada agent.</p>
          ) : (
            <div className="divide-y">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{agent.fullName}</p>
                    <p className="text-sm text-muted-foreground">{agent.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {agent.phone ?? "No phone"} &middot; {agent.propertyCount} properti
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(agent)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(agent.id, agent.fullName)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Agent" : "Tambah Agent Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="agentName">Nama Lengkap</Label>
              <Input
                id="agentName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            {!editId && (
              <div className="space-y-1">
                <Label htmlFor="agentEmail">Email</Label>
                <Input
                  id="agentEmail"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="agentPhone">Telepon (opsional)</Label>
              <Input
                id="agentPhone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+6281234567890"
              />
            </div>

            {createdPassword && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-amber-800">Agent berhasil dibuat!</p>
                <p className="text-amber-700 mt-1">
                  Password sementara: <code className="bg-amber-100 px-1 rounded">{createdPassword}</code>
                </p>
                <p className="text-amber-600 text-xs mt-1">Simpan password ini. Tidak akan ditampilkan lagi.</p>
              </div>
            )}

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <Button type="submit" className="w-full" disabled={formSaving}>
              {formSaving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Buat Agent"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
