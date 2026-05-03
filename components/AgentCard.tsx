import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Phone, Calendar } from "lucide-react"

interface Agent {
  fullName: string
  phone: string | null
}

interface AgentCardProps {
  agent: Agent | null
  createdAt: Date | null
}

export default function AgentCard({ agent, createdAt }: AgentCardProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-20 border rounded-xl p-5 space-y-4 bg-card">
        <h3 className="font-semibold">Hubungi Agen</h3>
        {agent ? (
          <>
            <div>
              <p className="font-medium">{agent.fullName}</p>
              {agent.phone && (
                <p className="text-sm text-muted-foreground">{agent.phone}</p>
              )}
            </div>
            {agent.phone && (
              <Button className="w-full" asChild>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Info agen tidak tersedia</p>
        )}
        <Separator />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Diposting{" "}
            {createdAt
              ? new Date(createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
      </div>
    </div>
  )
}
